import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tool, getToolById } from '../data/tools';
import { getGuideByToolId } from '../data/guides';

// Toolbox stages in clinical order
export const TOOLBOX_STAGES = [
  { id: 'scheduling', label: 'Scheduling/Communication', icon: '📅', categories: ['scheduling'] },
  { id: 'intake', label: 'Intake', icon: '📋', categories: ['intake'] },
  { id: 'documentation', label: 'Documentation', icon: '📝', categories: ['scribe'] },
  { id: 'communication', label: 'Assistance', icon: '💬', categories: ['chatbot'] },
  { id: 'billing', label: 'Billing', icon: '💰', categories: ['billing'] },
] as const;

export type ToolboxStageId = typeof TOOLBOX_STAGES[number]['id'];

export interface ToolboxState {
  scheduling: Tool | null;
  intake: Tool | null;
  documentation: Tool | null;
  communication: Tool | null;
  billing: Tool | null;
}

// Serialized tool data for API calls
export interface ToolboxItem {
  id: string;
  name: string;
  category: string;
  stage: ToolboxStageId;
  guide?: {
    overview: string;
    timeEstimate: string;
    prerequisites: string[];
    steps: { title: string; content: string }[];
    tips: string[];
  };
}

export interface SerializedToolbox {
  tools: ToolboxItem[];
  stages: {
    scheduling: string | null;
    intake: string | null;
    documentation: string | null;
    communication: string | null;
    billing: string | null;
  };
}

interface ToolboxContextType {
  toolbox: ToolboxState;
  addTool: (tool: Tool) => void;
  removeTool: (stageId: ToolboxStageId) => void;
  clearToolbox: () => void;
  getStageForTool: (tool: Tool) => ToolboxStageId | null;
  isToolInToolbox: (toolId: string) => boolean;
  filledStagesCount: number;
  getSerializedToolbox: () => SerializedToolbox;
}

const ToolboxContext = createContext<ToolboxContextType | null>(null);

const STORAGE_KEY = 'athen-toolbox';

// Map tool category to toolbox stage
export function getStageForToolCategory(category: Tool['category']): ToolboxStageId | null {
  switch (category) {
    case 'scheduling':
      return 'scheduling';
    case 'intake':
      return 'intake';
    case 'scribe':
      return 'documentation';
    case 'chatbot':
      return 'communication';
    case 'billing':
      return 'billing';
    case 'specialty':
      // Specialty tools can go in documentation by default
      return 'documentation';
    default:
      return null;
  }
}

function loadToolboxFromStorage(): ToolboxState {
  try {
    // Try new key first
    let saved = localStorage.getItem(STORAGE_KEY);
    
    // If not found, try migrating from old 'athen-workflow' key
    if (!saved) {
      const oldSaved = localStorage.getItem('athen-workflow');
      if (oldSaved) {
        try {
          const oldParsed = JSON.parse(oldSaved) as Record<string, string | null>;
          // Migrate old workflow data to new toolbox format
          const migrated = {
            scheduling: oldParsed.scheduling || null,
            intake: oldParsed.intake || null,
            documentation: oldParsed.documentation || null,
            communication: oldParsed.communication || null,
            billing: oldParsed.billing || null,
          };
          // Save to new key
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          saved = JSON.stringify(migrated);
        } catch (e) {
          console.error('Failed to migrate old workflow data:', e);
        }
      }
    }
    
    if (saved) {
      const parsed = JSON.parse(saved) as Record<string, string | null>;
      return {
        scheduling: parsed.scheduling ? getToolById(parsed.scheduling) || null : null,
        intake: parsed.intake ? getToolById(parsed.intake) || null : null,
        documentation: parsed.documentation ? getToolById(parsed.documentation) || null : null,
        communication: parsed.communication ? getToolById(parsed.communication) || null : null,
        billing: parsed.billing ? getToolById(parsed.billing) || null : null,
      };
    }
  } catch (e) {
    console.error('Failed to load toolbox from storage:', e);
  }
  return {
    scheduling: null,
    intake: null,
    documentation: null,
    communication: null,
    billing: null,
  };
}

function saveToolboxToStorage(toolbox: ToolboxState): void {
  try {
    const toSave = {
      scheduling: toolbox.scheduling?.id || null,
      intake: toolbox.intake?.id || null,
      documentation: toolbox.documentation?.id || null,
      communication: toolbox.communication?.id || null,
      billing: toolbox.billing?.id || null,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save toolbox to storage:', e);
  }
}

export function ToolboxProvider({ children }: { children: ReactNode }) {
  const [toolbox, setToolbox] = useState<ToolboxState>(loadToolboxFromStorage);

  // Save to localStorage whenever toolbox changes
  useEffect(() => {
    saveToolboxToStorage(toolbox);
  }, [toolbox]);

  const getStageForTool = (tool: Tool): ToolboxStageId | null => {
    return getStageForToolCategory(tool.category);
  };

  const addTool = (tool: Tool) => {
    const stage = getStageForTool(tool);
    if (!stage) return;

    setToolbox(prev => ({
      ...prev,
      [stage]: tool,
    }));
  };

  const removeTool = (stageId: ToolboxStageId) => {
    setToolbox(prev => ({
      ...prev,
      [stageId]: null,
    }));
  };

  const clearToolbox = () => {
    setToolbox({
      scheduling: null,
      intake: null,
      documentation: null,
      communication: null,
      billing: null,
    });
  };

  const isToolInToolbox = (toolId: string): boolean => {
    return Object.values(toolbox).some(tool => tool?.id === toolId);
  };

  const filledStagesCount = Object.values(toolbox).filter(tool => tool !== null).length;

  const getSerializedToolbox = (): SerializedToolbox => {
    const tools: ToolboxItem[] = [];
    const stages: SerializedToolbox['stages'] = {
      scheduling: null,
      intake: null,
      documentation: null,
      communication: null,
      billing: null,
    };

    const stageEntries: [ToolboxStageId, Tool | null][] = [
      ['scheduling', toolbox.scheduling],
      ['intake', toolbox.intake],
      ['documentation', toolbox.documentation],
      ['communication', toolbox.communication],
      ['billing', toolbox.billing],
    ];

    for (const [stageId, tool] of stageEntries) {
      if (tool) {
        stages[stageId] = tool.id;
        const guide = getGuideByToolId(tool.id);

        tools.push({
          id: tool.id,
          name: tool.name,
          category: tool.category,
          stage: stageId,
          guide: guide ? {
            overview: guide.overview,
            timeEstimate: guide.timeEstimate,
            prerequisites: guide.prerequisites,
            steps: guide.steps.map(s => ({ title: s.title, content: s.content })),
            tips: guide.tips,
          } : undefined,
        });
      }
    }

    return { tools, stages };
  };

  return (
    <ToolboxContext.Provider
      value={{
        toolbox,
        addTool,
        removeTool,
        clearToolbox,
        getStageForTool,
        isToolInToolbox,
        filledStagesCount,
        getSerializedToolbox,
      }}
    >
      {children}
    </ToolboxContext.Provider>
  );
}

export function useToolbox(): ToolboxContextType {
  const context = useContext(ToolboxContext);
  if (!context) {
    throw new Error('useToolbox must be used within a ToolboxProvider');
  }
  return context;
}
