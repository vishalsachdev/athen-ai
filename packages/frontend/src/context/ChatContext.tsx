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

const STORAGE_KEY = 'athen-suggested-tools';

function loadSuggestedToolsFromStorage(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as string[];
    }
  } catch (e) {
    console.error('Failed to load suggested tools from storage:', e);
  }
  return [];
}

function saveSuggestedToolsToStorage(toolIds: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toolIds));
  } catch (e) {
    console.error('Failed to save suggested tools to storage:', e);
  }
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestedToolIds, setSuggestedToolIds] = useState<string[]>(() => 
    loadSuggestedToolsFromStorage()
  );

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
      const updated = [...prev, toolId];
      saveSuggestedToolsToStorage(updated);
      return updated;
    });
  };

  const clearSuggestedTools = () => {
    setSuggestedToolIds([]);
    saveSuggestedToolsToStorage([]);
  };

  // Save to storage whenever suggested tools change
  React.useEffect(() => {
    saveSuggestedToolsToStorage(suggestedToolIds);
  }, [suggestedToolIds]);

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
