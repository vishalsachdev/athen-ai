import { getToolById } from '../data/tools';
import { useChat } from '../context/ChatContext';
import { useToolbox } from '../context/ToolboxContext';
import { useTabs } from '../context/TabContext';

export function SuggestedToolsTab() {
  const { suggestedToolIds, clearSuggestedTools } = useChat();
  const { isToolInToolbox, addTool } = useToolbox();
  const { openToolTab } = useTabs();

  // Get unique tools (in case of duplicates)
  const suggestedTools = suggestedToolIds
    .map(id => getToolById(id))
    .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-800">Suggested Tools</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {suggestedTools.length} {suggestedTools.length === 1 ? 'tool' : 'tools'} recommended based on your conversation
            </p>
          </div>
          {suggestedTools.length > 0 && (
            <button
              onClick={clearSuggestedTools}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Tools List - scrollable */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-6">
        {suggestedTools.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {suggestedTools.map(tool => (
              <div key={tool.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-800">{tool.name}</h4>
                      {tool.hipaaCompliant && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          HIPAA
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                        {tool.category === 'scribe' ? 'AI Scribe' : tool.category === 'specialty' ? tool.subcategory : tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{tool.description}</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2">
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
                  <button
                    onClick={() => addTool(tool)}
                    disabled={isToolInToolbox(tool.id)}
                    className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
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
                        Added to Toolbox ✓
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
                </div>
              </div>
            ))}
          </div>
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">No Tools Suggested Yet</h3>
      <p className="text-sm text-slate-500 max-w-sm">
        Start a conversation with the AI assistant to get personalized tool recommendations. Suggested tools will appear here automatically.
      </p>
    </div>
  );
}
