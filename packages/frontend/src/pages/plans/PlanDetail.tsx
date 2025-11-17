import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // Mock data
  const plan = {
    id: id,
    title: 'Patient Intake Form',
    summary: 'Automated patient intake and data collection workflow',
    status: 'active',
    privacy: 'private',
    version: 3,
    createdAt: '2 weeks ago',
    lastModified: '2 hours ago',
    estimatedTime: '15 mins',
    estimatedCost: '45 credits',
    steps: [
      {
        id: 1,
        title: 'Patient Information Collection',
        description: 'Collect basic demographic and insurance information',
        toolId: 'form-builder',
        estimatedCost: '5 credits',
        status: 'configured',
      },
      {
        id: 2,
        title: 'Medical History Review',
        description: 'Parse and structure patient medical history documents',
        toolId: 'document-parser',
        estimatedCost: '15 credits',
        status: 'configured',
      },
      {
        id: 3,
        title: 'AI-Powered Data Validation',
        description: 'Validate and flag inconsistencies in patient data',
        toolId: 'openai-gpt4',
        estimatedCost: '20 credits',
        status: 'configured',
      },
      {
        id: 4,
        title: 'Generate Summary Report',
        description: 'Create a structured summary for clinical review',
        toolId: 'report-generator',
        estimatedCost: '5 credits',
        status: 'configured',
      },
    ],
    connectedTools: ['OpenAI GPT-4', 'Document Parser'],
    requiredConnections: ['OpenAI'],
    versions: [
      { version: 3, date: '2 hours ago', changes: 'Updated validation logic' },
      { version: 2, date: '1 week ago', changes: 'Added medical history parsing' },
      { version: 1, date: '2 weeks ago', changes: 'Initial version' },
    ],
  };

  const handleActivateWorkflow = () => {
    navigate(`/workflows/new?planId=${id}`);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this plan?')) {
      navigate('/plans');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{plan.title}</h1>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {plan.status}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                v{plan.version}
              </span>
            </div>
            <p className="text-gray-600">{plan.summary}</p>
            <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
              <span>Created {plan.createdAt}</span>
              <span>•</span>
              <span>Modified {plan.lastModified}</span>
              <span>•</span>
              <span>🔒 Private</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={handleActivateWorkflow}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Activate Workflow
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Estimated Time</p>
          <p className="text-2xl font-bold text-gray-900">{plan.estimatedTime}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Estimated Cost</p>
          <p className="text-2xl font-bold text-gray-900">{plan.estimatedCost}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Total Steps</p>
          <p className="text-2xl font-bold text-gray-900">{plan.steps.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow Steps */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Workflow Steps</h2>
            </div>
            <div className="p-6 space-y-4">
              {plan.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{step.title}</h3>
                        {isEditing && (
                          <div className="flex items-center space-x-2">
                            <button className="text-sm text-blue-600 hover:text-blue-700">Edit</button>
                            <button className="text-sm text-red-600 hover:text-red-700">Remove</button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {step.toolId}
                        </span>
                        <span className="text-xs text-gray-500">{step.estimatedCost}</span>
                        <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                          ✓ {step.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isEditing && (
                <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 font-medium">
                  + Add Step
                </button>
              )}
            </div>
          </div>

          {/* Version History */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Version History</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {plan.versions.map((version) => (
                  <div key={version.version} className="flex items-start space-x-4 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                      v{version.version}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{version.changes}</p>
                      <p className="text-xs text-gray-500 mt-1">{version.date}</p>
                    </div>
                    {version.version !== plan.version && (
                      <button className="text-sm text-blue-600 hover:text-blue-700">Restore</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Connected Tools */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Connected Tools</h3>
            <div className="space-y-2">
              {plan.connectedTools.map((tool) => (
                <div key={tool} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                  <span className="text-sm text-gray-900">{tool}</span>
                  <span className="text-green-600">✓</span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Connections */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Required Connections</h3>
            <div className="space-y-2">
              {plan.requiredConnections.map((connection) => (
                <div key={connection} className="text-sm text-gray-700">
                  • {connection}
                </div>
              ))}
            </div>
            <Link
              to="/connections"
              className="block mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Manage Connections →
            </Link>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Privacy Settings</h3>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={plan.privacy}
              disabled={!isEditing}
            >
              <option value="private">🔒 Private (Only me)</option>
              <option value="org">🏢 Organization</option>
              <option value="public">🌐 Public (Community)</option>
            </select>
            {isEditing && (
              <p className="text-xs text-gray-500 mt-2">
                Public plans will be visible in the Community section
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                Duplicate Plan
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                Export Plan
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                Share Plan
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium"
              >
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
