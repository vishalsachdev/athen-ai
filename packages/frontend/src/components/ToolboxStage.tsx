import { Tool } from '../data/tools';
import { ToolboxStageId, useToolbox } from '../context/ToolboxContext';
import { useTabs } from '../context/TabContext';

interface ToolboxStageProps {
  id: ToolboxStageId;
  label: string;
  icon: string;
  tool: Tool | null;
  isLast?: boolean;
}

export function ToolboxStage({ id, label, icon, tool, isLast = false }: ToolboxStageProps) {
  const { removeTool } = useToolbox();
  const { openToolTab } = useTabs();

  return (
    <div className="relative">
      {/* Stage card */}
      {tool ? (
        <button
          onClick={() => openToolTab(tool.id, tool.name)}
          className="w-full text-left p-3 rounded-lg border bg-white border-indigo-200 hover:border-indigo-400 hover:shadow-sm transition-all group"
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{icon}</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
          </div>

          {/* Tool selected */}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{tool.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {tool.hipaaCompliant && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-medium">
                    HIPAA
                  </span>
                )}
                <span className="text-[10px] text-slate-400">{tool.setupTime}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeTool(id);
              }}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0"
              title="Remove from toolbox"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </button>
      ) : (
        <div className="p-3 rounded-lg border bg-slate-50 border-slate-200 border-dashed">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{icon}</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
          </div>
          {/* Empty slot */}
          <p className="text-xs text-slate-400 italic">No tool selected</p>
        </div>
      )}

      {/* Connector plus sign */}
      {!isLast && (
        <div className="flex justify-center py-1">
          <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      )}
    </div>
  );
}
