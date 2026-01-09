import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ToolTab {
  id: string;
  type: 'toolbox' | 'tool' | 'suggested';
  toolId?: string;
  title: string;
  isActive: boolean;
  canClose: boolean;
}

interface TabContextType {
  tabs: ToolTab[];
  activeTabId: string | null;
  openToolTab: (toolId: string, title: string) => void;
  openSuggestedToolsTab: () => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  getActiveTab: () => ToolTab | null;
  isToolTabOpen: (toolId: string) => boolean;
  getToolTabId: (toolId: string) => string | null;
  isSuggestedToolsTabOpen: () => boolean;
}

const TabContext = createContext<TabContextType | null>(null);

const STORAGE_KEY = 'athen-open-tabs';
const ACTIVE_TAB_KEY = 'athen-active-tab';

// Generate unique tab ID
function generateTabId(type: 'toolbox' | 'tool' | 'suggested', toolId?: string): string {
  if (type === 'toolbox') return 'toolbox';
  if (type === 'suggested') return 'suggested-tools';
  return `tool-${toolId}`;
}

function loadTabsFromStorage(): ToolTab[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Array<{
        id: string;
        type: 'toolbox' | 'tool' | 'suggested' | 'workflow'; // Support old 'workflow' type for migration
        toolId?: string;
        title: string;
        canClose: boolean;
      }>;
      // Migrate old 'workflow' type to 'toolbox'
      const migrated: ToolTab[] = parsed.map(tab => {
        if (tab.type === 'workflow') {
          return {
            ...tab,
            id: tab.id === 'workflow' ? 'toolbox' : tab.id,
            type: 'toolbox' as const,
            title: tab.title === 'Workflow' ? 'Toolbox' : tab.title,
            isActive: false,
          };
        }
        return { ...tab, type: tab.type as 'toolbox' | 'tool' | 'suggested', isActive: false };
      });
      
      // Ensure toolbox tab exists
      const hasToolbox = migrated.some(t => t.type === 'toolbox');
      if (!hasToolbox) {
        migrated.unshift({
          id: 'toolbox',
          type: 'toolbox',
          title: 'Toolbox',
          isActive: false,
          canClose: false,
        });
      }
      
      return migrated;
    }
  } catch (e) {
    console.error('Failed to load tabs from storage:', e);
  }
  
  // Default: always have toolbox tab
  return [
    {
      id: 'toolbox',
      type: 'toolbox',
      title: 'Toolbox',
      isActive: true,
      canClose: false,
    },
  ];
}

function loadActiveTabFromStorage(): string | null {
  try {
    const saved = localStorage.getItem(ACTIVE_TAB_KEY);
    // Migrate old 'workflow' tab ID to 'toolbox'
    if (saved === 'workflow') {
      return 'toolbox';
    }
    return saved;
  } catch (e) {
    return null;
  }
}

function saveTabsToStorage(tabs: ToolTab[]): void {
  try {
    const toSave = tabs.map(tab => ({
      id: tab.id,
      type: tab.type,
      toolId: tab.toolId,
      title: tab.title,
      canClose: tab.canClose,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save tabs to storage:', e);
  }
}

function saveActiveTabToStorage(tabId: string | null): void {
  try {
    if (tabId) {
      localStorage.setItem(ACTIVE_TAB_KEY, tabId);
    } else {
      localStorage.removeItem(ACTIVE_TAB_KEY);
    }
  } catch (e) {
    console.error('Failed to save active tab to storage:', e);
  }
}

export function TabProvider({ children }: { children: ReactNode }) {
  const initialTabs = loadTabsFromStorage();
  const initialActiveTab = loadActiveTabFromStorage() || 'toolbox';
  
  // Ensure toolbox tab exists
  const [tabs, setTabs] = useState<ToolTab[]>(() => {
    const hasToolbox = initialTabs.some(t => t.type === 'toolbox');
    if (!hasToolbox) {
      const toolboxTab = {
        id: 'toolbox',
        type: 'toolbox' as const,
        title: 'Toolbox',
        isActive: initialActiveTab === 'toolbox',
        canClose: false,
      };
      return [
        toolboxTab,
        ...initialTabs.map(t => ({ ...t, isActive: t.id === initialActiveTab })),
      ];
    }
    return initialTabs.map(t => ({ ...t, isActive: t.id === initialActiveTab }));
  });
  
  const [activeTabId, setActiveTabId] = useState<string | null>(() => {
    // Ensure activeTabId points to an existing tab, default to toolbox
    const tabExists = initialTabs.some(t => t.id === initialActiveTab);
    return tabExists ? initialActiveTab : 'toolbox';
  });

  // Ensure toolbox tab always exists
  useEffect(() => {
    setTabs(prev => {
      const hasToolbox = prev.some(t => t.type === 'toolbox');
      if (!hasToolbox) {
        return [
          {
            id: 'toolbox',
            type: 'toolbox',
            title: 'Toolbox',
            isActive: activeTabId === 'toolbox',
            canClose: false,
          },
          ...prev.map(t => ({ ...t, isActive: t.id === activeTabId })),
        ];
      }
      return prev;
    });
  }, []); // Only run once on mount

  // Update active tab state when activeTabId changes
  useEffect(() => {
    setTabs(prev =>
      prev.map(tab => ({
        ...tab,
        isActive: tab.id === activeTabId,
      }))
    );
  }, [activeTabId]);

  // Save tabs to localStorage whenever they change
  useEffect(() => {
    saveTabsToStorage(tabs);
  }, [tabs]);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    saveActiveTabToStorage(activeTabId);
  }, [activeTabId]);

  const openToolTab = (toolId: string, title: string) => {
    const tabId = generateTabId('tool', toolId);
    
    setTabs(prev => {
      // Check if tab already exists
      if (prev.some(t => t.id === tabId)) {
        // Tab exists, just activate it
        setActiveTabId(tabId);
        return prev;
      }

      // Create new tab and make it active
      const newTab: ToolTab = {
        id: tabId,
        type: 'tool',
        toolId,
        title,
        isActive: true,
        canClose: true,
      };

      // Set all other tabs to inactive
      const updatedTabs = prev.map(t => ({ ...t, isActive: false }));
      
      // Add new tab and activate it
      setActiveTabId(tabId);
      return [...updatedTabs, newTab];
    });
  };

  const closeTab = (tabId: string) => {
    if (tabId === 'toolbox') return; // Can't close toolbox tab

    setTabs(prev => {
      const filtered = prev.filter(t => t.id !== tabId);
      
      // If we closed the active tab, activate another one
      if (activeTabId === tabId) {
        // Find toolbox tab first, otherwise first available
        const toolboxTab = filtered.find(t => t.type === 'toolbox');
        const newActiveTab = toolboxTab || filtered[0];
        setActiveTabId(newActiveTab?.id || null);
      }
      
      return filtered.map(t => ({
        ...t,
        isActive: t.id === (activeTabId === tabId ? (filtered.find(t => t.type === 'toolbox') || filtered[0])?.id : activeTabId),
      }));
    });
  };

  const setActiveTab = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const getActiveTab = (): ToolTab | null => {
    return tabs.find(t => t.id === activeTabId) || null;
  };

  const isToolTabOpen = (toolId: string): boolean => {
    const tabId = generateTabId('tool', toolId);
    return tabs.some(t => t.id === tabId);
  };

  const getToolTabId = (toolId: string): string | null => {
    const tabId = generateTabId('tool', toolId);
    const tab = tabs.find(t => t.id === tabId);
    return tab ? tab.id : null;
  };

  const openSuggestedToolsTab = () => {
    const tabId = generateTabId('suggested');
    
    setTabs(prev => {
      // Check if tab already exists
      if (prev.some(t => t.id === tabId)) {
        // Tab exists, just activate it
        setActiveTabId(tabId);
        return prev;
      }

      // Create new tab and make it active
      const newTab: ToolTab = {
        id: tabId,
        type: 'suggested',
        title: 'Suggested Tools',
        isActive: true,
        canClose: true,
      };

      // Set all other tabs to inactive
      const updatedTabs = prev.map(t => ({ ...t, isActive: false }));
      
      // Add new tab and activate it
      setActiveTabId(tabId);
      return [...updatedTabs, newTab];
    });
  };

  const isSuggestedToolsTabOpen = (): boolean => {
    const tabId = generateTabId('suggested');
    return tabs.some(t => t.id === tabId);
  };

  return (
    <TabContext.Provider
      value={{
        tabs,
        activeTabId,
        openToolTab,
        openSuggestedToolsTab,
        closeTab,
        setActiveTab,
        getActiveTab,
        isToolTabOpen,
        getToolTabId,
        isSuggestedToolsTabOpen,
      }}
    >
      {children}
    </TabContext.Provider>
  );
}

export function useTabs(): TabContextType {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabProvider');
  }
  return context;
}

