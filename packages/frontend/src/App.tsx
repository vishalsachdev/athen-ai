import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Onboarding from './pages/auth/Onboarding';
import Dashboard from './pages/Dashboard';
import Planner from './pages/planner/Planner';
import MyPlans from './pages/plans/MyPlans';
import PlanDetail from './pages/plans/PlanDetail';
import Workflows from './pages/workflows/Workflows';
import WorkflowDetail from './pages/workflows/WorkflowDetail';
import Connections from './pages/connections/Connections';
import Files from './pages/files/Files';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  // Mock authentication state for MVP demo
  const isAuthenticated = true;
  const isOnboarded = true;

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          {isAuthenticated ? (
            <>
              {!isOnboarded ? (
                <Route path="/onboarding" element={<Onboarding />} />
              ) : (
                <Route element={<Layout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/planner" element={<Planner />} />
                  <Route path="/plans" element={<MyPlans />} />
                  <Route path="/plans/:id" element={<PlanDetail />} />
                  <Route path="/workflows" element={<Workflows />} />
                  <Route path="/workflows/:id" element={<WorkflowDetail />} />
                  <Route path="/connections" element={<Connections />} />
                  <Route path="/files" element={<Files />} />
                </Route>
              )}
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
