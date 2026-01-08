import type { Tool } from '../data/tools';
import { useTabs } from '../context/TabContext';
import { useToolbox } from '../context/ToolboxContext';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const { openToolTab } = useTabs();
  const { addTool, removeTool, isToolInToolbox, getStageForTool } = useToolbox();
  const isInToolbox = isToolInToolbox(tool.id);

  const handleToggleToolbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInToolbox) {
      const stage = getStageForTool(tool);
      if (stage) {
        removeTool(stage);
      }
    } else {
      addTool(tool);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-indigo-200 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 text-lg">{tool.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {tool.category === 'specialty' ? tool.subcategory : tool.category}
            </span>
            {tool.hipaaCompliant && (
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                HIPAA
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleToggleToolbox}
          className={`
            ml-3 flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
            ${isInToolbox
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }
          `}
          title={isInToolbox ? 'Remove from toolbox' : 'Add to toolbox'}
        >
          {isInToolbox ? (
            <>
              <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Added
            </>
          ) : (
            'Add to Toolbox'
          )}
        </button>
      </div>

      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
        {tool.description}
      </p>

      <div className="mb-4">
        <p className="text-xs text-slate-500 mb-2">Key features:</p>
        <div className="flex flex-wrap gap-1.5">
          {tool.keyFeatures.slice(0, 3).map((feature, i) => (
            <span key={i} className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
              {feature}
            </span>
          ))}
          {tool.keyFeatures.length > 3 && (
            <span className="text-xs text-slate-400 px-2 py-1">
              +{tool.keyFeatures.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="text-sm">
          <span className="text-slate-500">Pricing: </span>
          <span className="text-slate-700 font-medium">{tool.pricing}</span>
        </div>
        <button
          onClick={() => openToolTab(tool.id, tool.name)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          View Guide
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
