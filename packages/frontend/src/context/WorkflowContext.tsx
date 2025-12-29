import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tool, getToolById } from '../data/tools';
import { getGuideByToolId } from '../data/guides';

// Workflow stages in clinical order
export const WORKFLOW_STAGES = [
  { id: 'scheduling', label: 'Scheduling/Communication', icon: '📅', categories: ['scheduling'] },
  { id: 'intake', label: 'Intake', icon: '📋', categories: ['intake'] },
  { id: 'documentation', label: 'Documentation', icon: '📝', categories: ['scribe'] },
  { id: 'communication', label: 'Assistance', icon: '💬', categories: ['chatbot'] },
  { id: 'billing', label: 'Billing', icon: '💰', categories: ['billing'] },
] as const;

export type WorkflowStageId = typeof WORKFLOW_STAGES[number]['id'];

export interface WorkflowState {
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
  stage: WorkflowStageId;
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

interface WorkflowContextType {
  workflow: WorkflowState;
  isOpen: boolean;
  addTool: (tool: Tool) => void;
  removeTool: (stageId: WorkflowStageId) => void;
  clearWorkflow: () => void;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  getStageForTool: (tool: Tool) => WorkflowStageId | null;
  isToolInWorkflow: (toolId: string) => boolean;
  filledStagesCount: number;
  getSerializedToolbox: () => SerializedToolbox;
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

const STORAGE_KEY = 'athen-workflow';

// Map tool category to workflow stage
export function getStageForToolCategory(category: Tool['category']): WorkflowStageId | null {
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

function loadWorkflowFromStorage(): WorkflowState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
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
    console.error('Failed to load workflow from storage:', e);
  }
  return {
    scheduling: null,
    intake: null,
    documentation: null,
    communication: null,
    billing: null,
  };
}

function saveWorkflowToStorage(workflow: WorkflowState): void {
  try {
    const toSave = {
      scheduling: workflow.scheduling?.id || null,
      intake: workflow.intake?.id || null,
      documentation: workflow.documentation?.id || null,
      communication: workflow.communication?.id || null,
      billing: workflow.billing?.id || null,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save workflow to storage:', e);
  }
}

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [workflow, setWorkflow] = useState<WorkflowState>(loadWorkflowFromStorage);
  const [isOpen, setIsOpen] = useState(false);

  // Check if any tools are in workflow on mount to auto-open panel
  useEffect(() => {
    const hasTools = Object.values(workflow).some(tool => tool !== null);
    if (hasTools) {
      setIsOpen(true);
    }
  }, []);

  // Save to localStorage whenever workflow changes
  useEffect(() => {
    saveWorkflowToStorage(workflow);
  }, [workflow]);

  const getStageForTool = (tool: Tool): WorkflowStageId | null => {
    return getStageForToolCategory(tool.category);
  };

  const addTool = (tool: Tool) => {
    const stage = getStageForTool(tool);
    if (!stage) return;

    setWorkflow(prev => ({
      ...prev,
      [stage]: tool,
    }));
    setIsOpen(true);
  };

  const removeTool = (stageId: WorkflowStageId) => {
    setWorkflow(prev => ({
      ...prev,
      [stageId]: null,
    }));
  };

  const clearWorkflow = () => {
    setWorkflow({
      scheduling: null,
      intake: null,
      documentation: null,
      communication: null,
      billing: null,
    });
  };

  const openPanel = () => setIsOpen(true);
  const closePanel = () => setIsOpen(false);
  const togglePanel = () => setIsOpen(prev => !prev);

  const isToolInWorkflow = (toolId: string): boolean => {
    return Object.values(workflow).some(tool => tool?.id === toolId);
  };

  const filledStagesCount = Object.values(workflow).filter(tool => tool !== null).length;

  const getSerializedToolbox = (): SerializedToolbox => {
    const tools: ToolboxItem[] = [];
    const stages: SerializedToolbox['stages'] = {
      scheduling: null,
      intake: null,
      documentation: null,
      communication: null,
      billing: null,
    };

    const stageEntries: [WorkflowStageId, Tool | null][] = [
      ['scheduling', workflow.scheduling],
      ['intake', workflow.intake],
      ['documentation', workflow.documentation],
      ['communication', workflow.communication],
      ['billing', workflow.billing],
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
    <WorkflowContext.Provider
      value={{
        workflow,
        isOpen,
        addTool,
        removeTool,
        clearWorkflow,
        openPanel,
        closePanel,
        togglePanel,
        getStageForTool,
        isToolInWorkflow,
        filledStagesCount,
        getSerializedToolbox,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow(): WorkflowContextType {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}
