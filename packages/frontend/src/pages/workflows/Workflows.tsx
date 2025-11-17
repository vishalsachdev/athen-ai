import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Workflow {
  id: string;
  name: string;
  planTitle: string;
  status: 'active' | 'paused' | 'planned';
  lastRun: string | null;
  nextRun: string | null;
  totalRuns: number;
  successRate: number;
  creditsUsed: number;
}

export default function Workflows() {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data
  const workflows: Workflow[] = [
    {
      id: '1',
      name: 'Daily Patient Intake',
      planTitle: 'Patient Intake Form',
      status: 'active',
      lastRun: '2 hours ago',
      nextRun: 'In 22 hours',
      totalRuns: 45,
      successRate: 98,
      creditsUsed: 2025,
    },
    {
      id: '2',
      name: 'Morning Clinic Notes',
      planTitle: 'SOAP Note Generator',
      status: 'active',
      lastRun: '5 hours ago',
      nextRun: 'In 19 hours',
      totalRuns: 120,
      successRate: 95,
      creditsUsed: 3600,
    },
    {
      id: '3',
      name: 'Prior Auth - Wednesdays',
      planTitle: 'Prior Authorization Assistant',
      status: 'paused',
      lastRun: '3 days ago',
      nextRun: null,
      totalRuns: 12,
      successRate: 92,
      creditsUsed: 720,
    },
    {
      id: '4',
      name: 'Patient Education Materials',
      planTitle: 'Patient Instructions Generator',
      status: 'planned',
      lastRun: null,
      nextRun: 'Not scheduled',
      totalRuns: 0,
      successRate: 0,
      creditsUsed: 0,
    },
  ];

  const filteredWorkflows = workflows.filter((workflow) => {
    return filterStatus === 'all' || workflow.status === filterStatus;
  });

  const statusCounts = {
    all: workflows.length,
    active: workflows.filter((w) => w.status === 'active').length,
    paused: workflows.filter((w) => w.status === 'paused').length,
    planned: workflows.filter((w) => w.status === 'planned').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'planned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '▶️';
      case 'paused':
        return '⏸️';
      case 'planned':
        return '📋';
      default:
        return '📋';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
          <p className="text-gray-600 mt-1">Manage your active AI workflows</p>
        </div>
        <Link
          to="/plans"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <span className="mr-2">+</span>
          Activate New Workflow
        </Link>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex space-x-2">
          {(['all', 'active', 'paused', 'planned'] as const).map((status) => (
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

      {/* Workflows List */}
      <div className="space-y-4">
        {filteredWorkflows.map((workflow) => (
          <Link
            key={workflow.id}
            to={`/workflows/${workflow.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xl">{getStatusIcon(workflow.status)}</span>
                    <h3 className="text-xl font-semibold text-gray-900">{workflow.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        workflow.status
                      )}`}
                    >
                      {workflow.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Based on: {workflow.planTitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Runs</p>
                  <p className="text-2xl font-bold text-gray-900">{workflow.totalRuns}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Last Run</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {workflow.lastRun || 'Never'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Next Run</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {workflow.nextRun || 'Not scheduled'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Success Rate</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {workflow.successRate > 0 ? `${workflow.successRate}%` : 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Credits Used</p>
                  <p className="text-sm font-semibold text-gray-900">{workflow.creditsUsed}</p>
                </div>
              </div>

              {workflow.status === 'active' && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">Success Rate</span>
                    <span className="text-xs font-medium text-gray-900">
                      {workflow.successRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${workflow.successRate}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">⚙️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No workflows found</h3>
          <p className="text-gray-600 mb-6">
            Create a plan and activate it to start your first workflow
          </p>
          <Link
            to="/plans"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <span className="mr-2">+</span>
            View My Plans
          </Link>
        </div>
      )}
    </div>
  );
}
