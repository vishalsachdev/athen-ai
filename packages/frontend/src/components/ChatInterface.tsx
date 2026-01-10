import { useState, useRef, useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToolbox } from '../context/ToolboxContext';
import { useChat, Message } from '../context/ChatContext';
import { useTabs } from '../context/TabContext';

export function ChatInterface() {
  const { messages, setMessages, addSuggestedTool, suggestedToolIds } = useChat();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { getSerializedToolbox } = useToolbox();
  const { openSuggestedToolsTab, isSuggestedToolsTabOpen } = useTabs();

  // Auto-scroll to bottom when messages change (only within the chat container)
  useEffect(() => {
    if (messages.length > 0 && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // Extract tool IDs from assistant messages and create Suggested Tools tab
  useEffect(() => {
    const toolCardPattern = /\[\[TOOL:([a-z0-9-]+)\]\]/g;
    let shouldOpenTab = false;

    messages.forEach(message => {
      if (message.role === 'assistant' && message.content) {
        const matches = [...message.content.matchAll(toolCardPattern)];
        matches.forEach(match => {
          const toolId = match[1];
          if (!suggestedToolIds.includes(toolId)) {
            addSuggestedTool(toolId);
            shouldOpenTab = true;
          }
        });
      }
    });

    // Auto-open Suggested Tools tab when new tools are detected
    if (shouldOpenTab && !isSuggestedToolsTabOpen()) {
      openSuggestedToolsTab();
    }
  }, [messages, suggestedToolIds, addSuggestedTool, openSuggestedToolsTab, isSuggestedToolsTabOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Create assistant message placeholder
    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      // Get the current toolbox state to send as context
      const toolbox = getSerializedToolbox();
      console.log('Sending toolbox to API:', toolbox);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          toolbox: toolbox.tools.length > 0 ? toolbox : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      // Track accumulated content during streaming
      let accumulatedContent = '';
      let streamError: string | null = null;
      let streamDone = false;

      // Read the stream
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.trim()) continue; // Skip empty lines
            
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                // Check for error in stream
                if (data.error) {
                  streamError = data.error;
                  console.error('Stream error from backend:', data.error);
                  throw new Error(data.error);
                }
                
                // Check for done signal
                if (data.done) {
                  streamDone = true;
                  break; // This breaks the for loop, but we'll check streamDone below
                }
                
                // Handle content chunks
                if (data.content) {
                  accumulatedContent += data.content;
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === assistantId
                        ? { ...m, content: m.content + data.content }
                        : m
                    )
                  );
                }
              } catch (parseError) {
                // If it's an intentional error (not a parse error), re-throw it
                if (streamError) {
                  throw parseError;
                }
                // Ignore JSON parse errors for incomplete chunks (this is normal during streaming)
                if (parseError instanceof SyntaxError) {
                  continue;
                }
                // Re-throw other errors
                throw parseError;
              }
            }
          }
          
          // If stream is done, break out of the while loop
          if (streamDone) break;
        }
      } catch (streamReadError) {
        console.error('Stream read error:', streamReadError);
        // If we have accumulated content, keep it; otherwise show error
        if (accumulatedContent.trim().length === 0) {
          throw streamReadError;
        }
        // If we have some content, continue but log the error
        console.warn('Stream ended early but we have content:', accumulatedContent.substring(0, 100));
      }

      // After streaming completes successfully, generate AI suggestions for the assistant's message
      // Only if we got meaningful content and no stream error occurred
      if (!streamError && accumulatedContent.trim().length > 50) {
        // Fetch suggestions asynchronously (don't block UI)
        fetch('/api/suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assistantMessage: accumulatedContent.trim(),
          }),
        })
          .then(res => {
            if (!res.ok) {
              throw new Error(`Suggestions API returned ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            if (data.suggestions && Array.isArray(data.suggestions)) {
              setSuggestions(prev => ({
                ...prev,
                [assistantId]: data.suggestions,
              }));
            }
          })
          .catch(err => {
            console.error('Failed to generate suggestions:', err);
            // Continue without suggestions - not critical
          });
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Get a more descriptive error message
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
        // If it's a network error, provide a more helpful message
        if (error.message.includes('fetch') || error.message.includes('network')) {
          errorMessage = 'Unable to connect to the server. Please check your connection and try again.';
        } else if (error.message.includes('API key')) {
          errorMessage = 'Server configuration error. Please contact support.';
        }
      }
      
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: errorMessage }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Extract tool count from content
  const getToolCount = (content: string): number => {
    const toolCardPattern = /\[\[TOOL:([a-z0-9-]+)\]\]/g;
    const matches = [...content.matchAll(toolCardPattern)];
    return matches.length;
  };

  // Normalize numbered lists: fix markdown where content appears on a new line after the number
  // ReactMarkdown interprets "1.\n\nText" as a list item with a paragraph, causing unwanted spacing
  // We normalize to "1. Text" so content stays on the same line as the number
  // This handles the root cause: AI generates numbered lists with newlines after the number
  const normalizeNumberedLists = (markdown: string): string => {
    // Process line by line to handle all edge cases properly
    const lines = markdown.split('\n');
    const result: string[] = [];
    let i = 0;
    
    while (i < lines.length) {
      const currentLine = lines[i].trim();
      
      // Check if this line is just a number (e.g., "1." or "1. " with optional whitespace)
      const emptyNumberMatch = currentLine.match(/^(\d+\.)\s*$/);
      
      if (emptyNumberMatch) {
        const number = emptyNumberMatch[1];
        let j = i + 1;
        
        // Skip any blank lines after the number
        while (j < lines.length && lines[j].trim().length === 0) {
          j++;
        }
        
        // If we've run out of lines, skip this orphaned number
        if (j >= lines.length) {
          i++;
          continue;
        }
        
        // Check if the next non-empty line starts with another number (next list item)
        const nextLine = lines[j].trim();
        if (/^\d+\./.test(nextLine)) {
          // This was an orphaned number with no content, skip it
          i++;
          continue;
        }
        
        // The next non-empty line contains the content for this list item
        // Combine the number with that content on the same line
        result.push(`${number} ${nextLine}`);
        
        // Process any continuation lines (if content spans multiple lines)
        let k = j + 1;
        while (k < lines.length) {
          const continuationLine = lines[k].trim();
          
          // Stop if we hit another numbered list item
          if (/^\d+\./.test(continuationLine)) {
            break;
          }
          
          // Stop if we hit multiple blank lines (likely end of list)
          if (continuationLine.length === 0) {
            // Check if next line is also blank or starts a new numbered item
            if (k + 1 >= lines.length || lines[k + 1].trim().length === 0 || /^\d+\./.test(lines[k + 1].trim())) {
              break;
            }
          }
          
          // Add continuation line as a regular line (will render as part of the list item)
          if (continuationLine.length > 0) {
            result.push(continuationLine);
          }
          
          k++;
        }
        
        // Skip blank line if present before next list item
        if (k < lines.length && lines[k].trim().length === 0) {
          k++;
        }
        
        i = k;
      } else {
        // Regular line, keep as-is
        result.push(lines[i]);
        i++;
      }
    }
    
    return result.join('\n');
  };

  // Render markdown content, removing tool card markers and showing indicator
  const renderContent = (content: string): ReactNode[] => {
    const toolCardPattern = /\[\[TOOL:[a-z0-9-]+\]\]/g;
    const toolCount = getToolCount(content);
    
    // Remove tool markers from content before rendering
    let cleanedContent = content.replace(toolCardPattern, '').trim();
    
    // Normalize numbered lists to ensure content is on same line as number
    cleanedContent = normalizeNumberedLists(cleanedContent);

    return [
      // Render markdown for text content
      cleanedContent && (
        <ReactMarkdown
          key="md-content"
          remarkPlugins={[remarkGfm]}
          components={{
            // Custom link renderer for internal /tools/ links
            a: ({ href, children }) => {
              if (href?.startsWith('/tools/')) {
                return (
                  <Link to={href} className="text-indigo-600 hover:text-indigo-700 underline">
                    {children}
                  </Link>
                );
              }
              return (
                <a href={href} className="text-indigo-600 hover:text-indigo-700 underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              );
            },
            // Style headers with more vertical space
            h3: ({ children }) => <h3 className="text-base font-semibold text-slate-800 mt-6 mb-3">{children}</h3>,
            h4: ({ children }) => <h4 className="text-sm font-semibold text-slate-700 mt-5 mb-2">{children}</h4>,
            // Style lists with more breathing room
            ul: ({ children }) => <ul className="list-disc list-inside space-y-2 my-4 pl-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 my-4 pl-1">{children}</ol>,
            // List items: remove all margins from paragraphs inside list items
            // This fixes the issue where "1.\n\nText" creates <li><p>Text</p></li> with unwanted spacing
            // The normalization function should fix most cases, but this CSS handles edge cases
            li: ({ children, ...props }) => {
              return (
                <li 
                  className="text-slate-700 leading-relaxed [&>p]:mb-0 [&>p]:mt-0 [&>p:first-child]:inline" 
                  {...props}
                >
                  {children}
                </li>
              );
            },
            // Style paragraphs with spacing, but list items will override margin via CSS selector above
            p: ({ children, ...props }) => {
              return <p className="mb-4 leading-relaxed" {...props}>{children}</p>;
            },
            // Style strong/bold
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            // Style horizontal rules with spacing
            hr: () => <hr className="my-6 border-slate-200" />,
            // Style tables
            table: ({ children }) => (
              <table className="w-full my-4 border-collapse border border-slate-200 rounded-lg overflow-hidden">
                {children}
              </table>
            ),
            thead: ({ children }) => <thead className="bg-slate-50">{children}</thead>,
            tbody: ({ children }) => <tbody>{children}</tbody>,
            tr: ({ children }) => <tr className="border-b border-slate-200 last:border-b-0">{children}</tr>,
            th: ({ children }) => <th className="px-3 py-2 text-left text-sm font-semibold text-slate-700 border-r border-slate-200 last:border-r-0">{children}</th>,
            td: ({ children }) => <td className="px-3 py-2 text-sm text-slate-600 border-r border-slate-200 last:border-r-0">{children}</td>,
          }}
        >
          {cleanedContent}
        </ReactMarkdown>
      ),
      // Show tool indicator at the bottom if tools were suggested
      toolCount > 0 && (
        <div key="tool-indicator" className="mt-3">
          <button
            onClick={() => openSuggestedToolsTab()}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            {toolCount} {toolCount === 1 ? 'tool' : 'tools'} suggested — view in Suggested Tools tab
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      ),
    ].filter(Boolean) as ReactNode[];
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Messages area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              How can I help you today?
            </h3>
            <p className="text-slate-500 text-sm max-w-md">
              Tell me about your practice and what challenges you're facing. I'll recommend the right AI tools for your toolbox.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {[
                'I spend too much time on documentation',
                'I need help with patient intake',
                'Looking for a scheduling solution',
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="text-sm px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          (() => {
            // Find the index of the last assistant message
            let lastAssistantIndex = -1;
            for (let i = messages.length - 1; i >= 0; i--) {
              if (messages[i].role === 'assistant') {
                lastAssistantIndex = i;
                break;
              }
            }

            return messages.map((message, index) => {
              // Check if this is the last assistant message and it's complete
              const isLastAssistantMessage = message.role === 'assistant' && 
                index === lastAssistantIndex && 
                !isLoading && 
                message.content.trim();

              return (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' ? (
                    <div className="max-w-xl w-full">
                      <div className="text-sm leading-relaxed text-slate-800">
                        {renderContent(message.content)}
                        {isLoading && message.content === '' && (
                          <div className="bg-slate-100 rounded-2xl px-4 py-3 inline-flex gap-1">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        )}
                      </div>
                      {/* Show suggested responses only on the last completed assistant message */}
                      {isLastAssistantMessage && (
                        <SuggestedResponses 
                          messageId={message.id}
                          suggestions={suggestions[message.id] || []}
                          onSelect={(suggestion) => {
                            setInput(suggestion);
                            inputRef.current?.focus();
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-indigo-600 text-white">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  )}
                </div>
              );
            });
          })()
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your challenge..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Athen AI helps you find healthcare tools. Always verify compliance requirements for your practice.
        </p>
      </div>
    </div>
  );
}

interface SuggestedResponsesProps {
  messageId: string;
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

function SuggestedResponses({ suggestions, onSelect }: SuggestedResponsesProps) {
  // Don't show suggestions if none were generated
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 hover:text-slate-900 transition-colors border border-slate-200"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
