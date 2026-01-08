import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { SolutionSearch } from './components/SolutionSearch';
import { ToolboxProvider } from './context/ToolboxContext';
import { ChatProvider } from './context/ChatContext';
import { TabProvider, useTabs } from './context/TabContext';
import { getToolById } from './data/tools';

// Handle /tools/:toolId route - opens tool in tab
function ToolRouteHandler() {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const { openToolTab } = useTabs();

  useEffect(() => {
    if (toolId) {
      const tool = getToolById(toolId);
      if (tool) {
        openToolTab(toolId, tool.name);
      }
      // Redirect to home after opening tab
      navigate('/', { replace: true });
    }
  }, [toolId, openToolTab, navigate]);

  return null;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<SolutionSearch />} />
        <Route path="/tools/:toolId" element={<ToolRouteHandler />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ToolboxProvider>
      <ChatProvider>
        <TabProvider>
          <AppContent />
        </TabProvider>
      </ChatProvider>
    </ToolboxProvider>
  );
}

export default App;
