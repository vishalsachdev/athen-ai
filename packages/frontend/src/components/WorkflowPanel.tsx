import { WORKFLOW_STAGES, useWorkflow } from '../context/WorkflowContext';
import { WorkflowStage } from './WorkflowStage';

export function WorkflowPanel() {
  const { workflow, isOpen, closePanel, clearWorkflow, filledStagesCount } = useWorkflow();

  if (!isOpen) return null;

  return (
    <div className="w-80 flex-shrink-0 h-[600px] transition-all duration-300 ease-in-out">
      <div className="h-full flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Your AI Toolbox</h3>
              <p className="text-xs text-slate-500">{filledStagesCount} of {WORKFLOW_STAGES.length} tools</p>
            </div>
            <button
              onClick={closePanel}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Close panel"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stages - scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {WORKFLOW_STAGES.map((stage, index) => (
            <WorkflowStage
              key={stage.id}
              id={stage.id}
              label={stage.label}
              icon={stage.icon}
              tool={workflow[stage.id]}
              isLast={index === WORKFLOW_STAGES.length - 1}
            />
          ))}
        </div>

        {/* Footer */}
        {filledStagesCount > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex-shrink-0">
            <button
              onClick={clearWorkflow}
              className="w-full px-3 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear Toolbox
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
