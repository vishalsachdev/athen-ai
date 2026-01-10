import { createContext, useContext, useState, ReactNode } from 'react';
import * as React from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  clearMessages: () => void;
  suggestedToolIds: string[];
  addSuggestedTool: (toolId: string) => void;
  clearSuggestedTools: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  // Initialize with empty state - no persistence across refreshes
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestedToolIds, setSuggestedToolIds] = useState<string[]>([]);

  const clearMessages = () => {
    setMessages([]);
    clearSuggestedTools();
  };

  const addSuggestedTool = (toolId: string) => {
    setSuggestedToolIds(prev => {
      // Avoid duplicates
      if (prev.includes(toolId)) {
        return prev;
      }
      return [...prev, toolId];
    });
  };

  const clearSuggestedTools = () => {
    setSuggestedToolIds([]);
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      setMessages, 
      clearMessages,
      suggestedToolIds,
      addSuggestedTool,
      clearSuggestedTools,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
