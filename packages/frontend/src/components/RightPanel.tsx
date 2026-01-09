import { useTabs } from '../context/TabContext';
import { ToolboxTab } from './ToolboxTab';
import { ToolTab } from './ToolTab';
import { SuggestedToolsTab } from './SuggestedToolsTab';

export function RightPanel() {
  const { tabs, activeTabId } = useTabs();
  const activeTab = tabs.find(t => t.id === activeTabId);

  // If no active tab, default to toolbox
  const displayTab = activeTab || tabs.find(t => t.type === 'toolbox') || tabs[0];

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

function TabButton({ tab }: { tab: { id: string; title: string; isActive: boolean; canClose: boolean } }) {
  const { setActiveTab, closeTab } = useTabs();

  return (
    <button
      onClick={() => setActiveTab(tab.id)}
      className={`
        relative flex items-center ${tab.canClose ? 'justify-between' : 'justify-center'} gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 min-w-[120px] max-w-[200px]
        ${
          tab.isActive
            ? 'border-indigo-600 text-indigo-600 bg-white'
            : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-100'
        }
      `}
    >
      <span className="truncate">{tab.title}</span>
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
    </button>
  );
}

