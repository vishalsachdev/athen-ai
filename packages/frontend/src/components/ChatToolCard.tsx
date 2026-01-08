import { getToolById } from '../data/tools';
import { useToolbox } from '../context/ToolboxContext';
import { useTabs } from '../context/TabContext';

interface ChatToolCardProps {
  toolId: string;
}

export function ChatToolCard({ toolId }: ChatToolCardProps) {
  const tool = getToolById(toolId);
  const { addTool, isToolInToolbox, getStageForTool } = useToolbox();
  const { openToolTab } = useTabs();

  if (!tool) {
    return (
      <div className="my-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
        Tool not found: {toolId}
      </div>
    );
  }

  // Determine pricing display
  const getPricingBadge = () => {
    if (tool.pricingTier === 'free') {
      return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">FREE</span>;
    }
    if (tool.pricingTier === 'low') {
      return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">$</span>;
    }
    if (tool.pricingTier === 'medium') {
      return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">$$</span>;
    }
    return <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Enterprise</span>;
  };

  // Get category icon
  const getCategoryIcon = () => {
    switch (tool.category) {
      case 'scribe':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'intake':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'chatbot':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      case 'scheduling':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <div className="my-5 p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow max-w-xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
            {getCategoryIcon()}
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">{tool.name}</h4>
            <p className="text-xs text-slate-500">{tool.category === 'scribe' ? 'AI Scribe' : tool.category === 'specialty' ? tool.subcategory : tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tool.hipaaCompliant && (
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              HIPAA
            </span>
          )}
          {getPricingBadge()}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{tool.description}</p>

      {/* Setup info */}
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {tool.setupTime} setup
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          {tool.setupDifficulty} difficulty
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => openToolTab(tool.id, tool.name)}
          className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors text-center"
        >
          {tool.id === 'freed-ai' || tool.id === 'doximity-scribe' || tool.id === 'intakeq'
            ? 'View Setup Guide'
            : 'Learn More'}
        </button>
        <a
          href={tool.website}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1"
        >
          <span>Website</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Add to Toolbox button */}
      {getStageForTool(tool) && (
        <button
          onClick={() => addTool(tool)}
          disabled={isToolInToolbox(tool.id)}
          className={`w-full mt-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            isToolInToolbox(tool.id)
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          {isToolInToolbox(tool.id) ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              In Toolbox
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add to Toolbox
            </>
          )}
        </button>
      )}
    </div>
  );
}
