import { Routes, Route } from 'react-router-dom';
import { SolutionSearch } from './components/SolutionSearch';
import { ToolGuide } from './pages/ToolGuide';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-12">
      <Routes>
        <Route path="/" element={<SolutionSearch />} />
        <Route path="/tools/:toolId" element={<ToolGuide />} />
      </Routes>
    </div>
  );
}

export default App;
