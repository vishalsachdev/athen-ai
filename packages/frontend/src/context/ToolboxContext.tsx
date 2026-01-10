import { createContext, useContext, useState, ReactNode } from 'react';
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
  unseenNewToolsCount: number;
  markToolsAsSeen: () => void;
}

const ToolboxContext = createContext<ToolboxContextType | null>(null);

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


export function ToolboxProvider({ children }: { children: ReactNode }) {
  // Initialize with empty toolbox state - no persistence across refreshes
  const [toolbox, setToolbox] = useState<ToolboxState>({
    scheduling: null,
    intake: null,
    documentation: null,
    communication: null,
    billing: null,
  });
  
  // Track unseen new tools count (tools added but not yet viewed in Toolbox tab)
  // No persistence - resets on refresh
  const [unseenNewToolsCount, setUnseenNewToolsCount] = useState<number>(0);

  const getStageForTool = (tool: Tool): ToolboxStageId | null => {
    return getStageForToolCategory(tool.category);
  };

  const addTool = (tool: Tool) => {
    const stage = getStageForTool(tool);
    if (!stage) return;

    // Check if this tool is replacing an existing tool or adding a new one
    setToolbox(prev => {
      const wasEmpty = !prev[stage];
      const isNewTool = wasEmpty || prev[stage]?.id !== tool.id;

      if (isNewTool) {
        // Increment unseen count when a new tool is added
        setUnseenNewToolsCount(prevCount => prevCount + 1);
      }

      return {
        ...prev,
        [stage]: tool,
      };
    });
  };

  const markToolsAsSeen = () => {
    setUnseenNewToolsCount(0);
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
        unseenNewToolsCount,
        markToolsAsSeen,
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
