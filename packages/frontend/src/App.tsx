import { Routes, Route } from 'react-router-dom';
import { SolutionSearch } from './components/SolutionSearch';
import { ToolGuide } from './pages/ToolGuide';
import { WorkflowProvider } from './context/WorkflowContext';
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <WorkflowProvider>
      <ChatProvider>
        <div className="min-h-screen bg-gray-50 pt-4 pb-12">
          <Routes>
            <Route path="/" element={<SolutionSearch />} />
            <Route path="/tools/:toolId" element={<ToolGuide />} />
          </Routes>
        </div>
      </ChatProvider>
    </WorkflowProvider>
  );
}

export default App;
