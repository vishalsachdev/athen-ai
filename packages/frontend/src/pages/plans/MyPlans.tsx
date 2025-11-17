import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Plan {
  id: string;
  title: string;
  summary: string;
  status: 'draft' | 'active' | 'archived';
  privacy: 'private' | 'org' | 'public';
  lastModified: string;
  version: number;
  estimatedCost: string;
}

export default function MyPlans() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const plans: Plan[] = [
    {
      id: '1',
      title: 'Patient Intake Form',
      summary: 'Automated patient intake and data collection workflow',
      status: 'active',
      privacy: 'private',
      lastModified: '2 hours ago',
      version: 3,
      estimatedCost: '45 credits/run',
    },
    {
      id: '2',
      title: 'SOAP Note Generator',
      summary: 'Generate structured SOAP notes from patient encounters',
      status: 'draft',
      privacy: 'private',
      lastModified: '1 day ago',
      version: 1,
      estimatedCost: '30 credits/run',
    },
    {
      id: '3',
      title: 'Prior Authorization Assistant',
      summary: 'Automate prior authorization packet preparation',
      status: 'active',
      privacy: 'org',
      lastModified: '3 days ago',
      version: 5,
      estimatedCost: '60 credits/run',
    },
    {
      id: '4',
      title: 'Patient Instructions Generator',
      summary: 'Create multilingual patient discharge instructions',
      status: 'active',
      privacy: 'public',
      lastModified: '1 week ago',
      version: 2,
      estimatedCost: '25 credits/run',
    },
    {
      id: '5',
      title: 'H&P Template - Orthopedic',
      summary: 'History and Physical template for orthopedic surgery',
      status: 'archived',
      privacy: 'private',
      lastModified: '2 weeks ago',
      version: 1,
      estimatedCost: '35 credits/run',
    },
  ];

  const filteredPlans = plans.filter((plan) => {
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    const matchesSearch =
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: plans.length,
    active: plans.filter((p) => p.status === 'active').length,
    draft: plans.filter((p) => p.status === 'draft').length,
    archived: plans.filter((p) => p.status === 'archived').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'private':
        return '🔒';
      case 'org':
        return '🏢';
      case 'public':
        return '🌐';
      default:
        return '🔒';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Plans</h1>
          <p className="text-gray-600 mt-1">Manage your AI workflow plans</p>
        </div>
        <Link
          to="/planner"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <span className="mr-2">+</span>
          Create New Plan
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plans..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            {(['all', 'active', 'draft', 'archived'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Link
            key={plan.id}
            to={`/plans/${plan.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{plan.summary}</p>
              </div>
              <span className="text-xl ml-2">{getPrivacyIcon(plan.privacy)}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    plan.status
                  )}`}
                >
                  {plan.status}
                </span>
                <span className="text-xs text-gray-500">v{plan.version}</span>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Cost per run</span>
                  <span className="font-medium text-gray-900">{plan.estimatedCost}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Last modified</span>
                  <span className="text-gray-900">{plan.lastModified}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No plans found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? 'Try adjusting your search query'
              : "You haven't created any plans yet. Get started by creating your first AI workflow!"}
          </p>
          {!searchQuery && (
            <Link
              to="/planner"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <span className="mr-2">+</span>
              Create Your First Plan
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
