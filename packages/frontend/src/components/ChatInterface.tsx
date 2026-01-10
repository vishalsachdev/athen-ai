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

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                setMessages(prev =>
                  prev.map(m =>
                    m.id === assistantId
                      ? { ...m, content: m.content + data.content }
                      : m
                  )
                );
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: 'Sorry, I encountered an error. Please try again.' }
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

  // Render markdown content, removing tool card markers and showing indicator
  const renderContent = (content: string): ReactNode[] => {
    const toolCardPattern = /\[\[TOOL:[a-z0-9-]+\]\]/g;
    const toolCount = getToolCount(content);
    
    // Remove tool markers from content before rendering
    const cleanedContent = content.replace(toolCardPattern, '').trim();

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
            li: ({ children }) => <li className="text-slate-700 leading-relaxed">{children}</li>,
            // Style paragraphs with more spacing
            p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
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
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' ? (
                <div className="max-w-xl">
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
                </div>
              ) : (
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-indigo-600 text-white">
                  <p className="text-sm">{message.content}</p>
                </div>
              )}
            </div>
          ))
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
