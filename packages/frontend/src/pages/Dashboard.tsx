import { Link } from 'react-router-dom';

export default function Dashboard() {
  // Mock data for MVP demo
  const metrics = {
    plansCreated: 5,
    activeWorkflows: 3,
    timeSaved: '12.5 hours',
    creditsUsed: 750,
    creditsRemaining: 1250,
  };

  const recentPlans = [
    { id: '1', title: 'Patient Intake Form', status: 'active', lastModified: '2 hours ago' },
    { id: '2', title: 'SOAP Note Generator', status: 'draft', lastModified: '1 day ago' },
    { id: '3', title: 'Prior Authorization Assistant', status: 'active', lastModified: '3 days ago' },
  ];

  const trendingTools = [
    { name: 'OpenAI GPT-4', category: 'LLM', usage: '85%' },
    { name: 'Google Gemini', category: 'LLM', usage: '45%' },
    { name: 'Document Parser', category: 'Utility', usage: '62%' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Dr. Smith!</h1>
        <p className="text-blue-100">
          You've saved {metrics.timeSaved} this month with AI-powered workflows
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Plans Created</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.plansCreated}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/plans" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all plans →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Workflows</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.activeWorkflows}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚙️</span>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/workflows" className="text-sm text-green-600 hover:text-green-700 font-medium">
              Manage workflows →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Time Saved</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.timeSaved}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">This month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Credits</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.creditsRemaining}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${(metrics.creditsRemaining / (metrics.creditsUsed + metrics.creditsRemaining)) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{metrics.creditsUsed} used this month</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Plans */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Plans</h2>
              <Link to="/plans" className="text-sm text-blue-600 hover:text-blue-700">
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentPlans.map((plan) => (
                <Link
                  key={plan.id}
                  to={`/plans/${plan.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{plan.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">Modified {plan.lastModified}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        plan.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {plan.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Trending Tools */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/planner"
                className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-medium"
              >
                <span className="mr-2">🎯</span>
                Create New Plan
              </Link>
              <Link
                to="/connections"
                className="block w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-center font-medium"
              >
                <span className="mr-2">🔌</span>
                Connect AI Tool
              </Link>
              <Link
                to="/files"
                className="block w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center font-medium"
              >
                <span className="mr-2">📁</span>
                Upload Files
              </Link>
            </div>
          </div>

          {/* Trending Tools */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trending Tools</h2>
            <div className="space-y-4">
              {trendingTools.map((tool, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{tool.name}</p>
                    <p className="text-xs text-gray-500">{tool.category}</p>
                  </div>
                  <div className="text-sm font-medium text-blue-600">{tool.usage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Story Banner */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <span className="text-4xl">🌟</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Success Story</h3>
            <p className="text-gray-700 mb-3">
              "Using Athen AI's Prior Authorization workflow, I reduced my packet preparation time from 45 minutes to just 8 minutes per case. The automated checklist ensures I never miss required documentation."
            </p>
            <p className="text-sm text-gray-600">
              — Dr. Michael Chen, Orthopedic Surgery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
