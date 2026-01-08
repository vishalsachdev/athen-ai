import { TOOLBOX_STAGES, useToolbox } from '../context/ToolboxContext';
import { ToolboxStage } from './ToolboxStage';

export function ToolboxTab() {
  const { toolbox, clearToolbox, filledStagesCount } = useToolbox();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-800">Your AI Toolbox</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {filledStagesCount} of {TOOLBOX_STAGES.length} tools added
            </p>
          </div>
          {filledStagesCount > 0 && (
            <button
              onClick={clearToolbox}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Stages - scrollable */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-1">
        {filledStagesCount === 0 ? (
          <EmptyState />
        ) : (
          TOOLBOX_STAGES.map((stage, index) => (
            <ToolboxStage
              key={stage.id}
              id={stage.id}
              label={stage.label}
              icon={stage.icon}
              tool={toolbox[stage.id]}
              isLast={index === TOOLBOX_STAGES.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Build Your Toolbox</h3>
      <p className="text-sm text-slate-500 max-w-sm">
        Start a conversation with the AI assistant to get personalized tool recommendations, or browse all available tools below.
      </p>
    </div>
  );
}

