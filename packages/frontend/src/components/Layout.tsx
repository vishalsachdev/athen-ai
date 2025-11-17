import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Assistant from './Assistant';

export default function Layout() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Planner', path: '/planner', icon: '🎯' },
    { name: 'My Plans', path: '/plans', icon: '📋' },
    { name: 'Workflows', path: '/workflows', icon: '⚙️' },
    { name: 'Connections', path: '/connections', icon: '🔌' },
    { name: 'Files', path: '/files', icon: '📁' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">Athen AI</h1>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                      location.pathname.startsWith(item.path)
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Credits Display */}
              <div className="flex items-center px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                <span className="text-sm font-medium text-green-700">💰 1,250 credits</span>
              </div>

              {/* Assistant Toggle */}
              <button
                onClick={() => setIsAssistantOpen(!isAssistantOpen)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <span className="mr-2">🤖</span>
                Assistant
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Dr. Smith</span>
                <button className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  S
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>

        {/* Assistant Side Panel */}
        <Assistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
      </div>

      {/* HIPAA Compliance Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-blue-900 text-white py-2 px-4 text-center text-xs">
        🔒 HIPAA Compliant Platform - All data encrypted in transit and at rest
      </div>
    </div>
  );
}
