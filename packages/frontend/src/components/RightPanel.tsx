import { useEffect } from 'react';
import { useTabs, ToolTab as ToolTabType } from '../context/TabContext';
import { useToolbox } from '../context/ToolboxContext';
import { ToolboxTab } from './ToolboxTab';
import { ToolTab } from './ToolTab';
import { SuggestedToolsTab } from './SuggestedToolsTab';

export function RightPanel() {
  const { tabs, activeTabId } = useTabs();
  const { markToolsAsSeen } = useToolbox();
  const activeTab = tabs.find(t => t.id === activeTabId);

  // If no active tab, default to toolbox
  const displayTab = activeTab || tabs.find(t => t.type === 'toolbox') || tabs[0];

  // Mark tools as seen when Toolbox tab is opened
  useEffect(() => {
    if (activeTabId === 'toolbox') {
      markToolsAsSeen();
    }
  }, [activeTabId, markToolsAsSeen]);

  // Ensure we always have a tab to display
  if (!displayTab) {
    return (
      <div className="h-full flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Tab Navigation */}
      {tabs.length > 0 && (
        <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50 overflow-x-auto">
          <div className="flex min-w-0">
            {tabs.map(tab => (
              <TabButton key={tab.id} tab={tab} />
            ))}
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {displayTab.type === 'toolbox' && <ToolboxTab />}
        {displayTab.type === 'suggested' && <SuggestedToolsTab />}
        {displayTab.type === 'tool' && displayTab.toolId && (
          <ToolTab toolId={displayTab.toolId} />
        )}
        {displayTab.type !== 'toolbox' && displayTab.type !== 'suggested' && displayTab.type !== 'tool' && (
          <div className="p-6">
            <p className="text-slate-500">Unknown tab type</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ tab }: { tab: ToolTabType }) {
  const { setActiveTab, closeTab } = useTabs();
  const { unseenNewToolsCount } = useToolbox();
  
  // Show badge only for Toolbox tab when there are unseen new tools
  const showBadge = tab.type === 'toolbox' && unseenNewToolsCount > 0;

  return (
    <button
      onClick={() => setActiveTab(tab.id)}
      className={`
        relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 min-w-[120px] max-w-[200px]
        ${tab.canClose ? 'justify-between' : 'justify-center'}
        ${
          tab.isActive
            ? 'border-indigo-600 text-indigo-600 bg-white'
            : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-100'
        }
      `}
    >
      <span className="truncate">{tab.title}</span>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {showBadge && (
          <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1.5 bg-red-500 text-white text-xs font-semibold rounded-full">
            {unseenNewToolsCount > 99 ? '99+' : unseenNewToolsCount}
          </span>
        )}
        {tab.canClose && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
            className={`
              p-0.5 rounded hover:bg-slate-200 transition-colors flex-shrink-0
              ${tab.isActive ? 'text-slate-600' : 'text-slate-400'}
            `}
            title="Close tab"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </button>
  );
}

