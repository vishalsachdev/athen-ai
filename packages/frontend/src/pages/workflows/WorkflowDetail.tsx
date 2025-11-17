import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function WorkflowDetail() {
  const { id } = useParams();
  const [showDryRun, setShowDryRun] = useState(false);

  // Mock data
  const workflow = {
    id: id,
    name: 'Daily Patient Intake',
    planTitle: 'Patient Intake Form',
    status: 'active',
    lastRun: '2 hours ago',
    nextRun: 'In 22 hours',
    totalRuns: 45,
    successRate: 98,
    creditsUsed: 2025,
    avgTimePerRun: '12 mins',
    parameters: {
      aiModel: 'GPT-4',
      outputFormat: 'Structured JSON',
      autoSubmit: false,
      notifyOnCompletion: true,
    },
    recentRuns: [
      {
        id: 'run-1',
        startedAt: '2 hours ago',
        completedAt: '2 hours ago',
        status: 'success',
        creditsUsed: 45,
        duration: '11 mins',
      },
      {
        id: 'run-2',
        startedAt: '1 day ago',
        completedAt: '1 day ago',
        status: 'success',
        creditsUsed: 47,
        duration: '13 mins',
      },
      {
        id: 'run-3',
        startedAt: '2 days ago',
        completedAt: '2 days ago',
        status: 'failed',
        creditsUsed: 12,
        duration: '3 mins',
        error: 'API rate limit exceeded',
      },
      {
        id: 'run-4',
        startedAt: '3 days ago',
        completedAt: '3 days ago',
        status: 'success',
        creditsUsed: 44,
        duration: '10 mins',
      },
    ],
    executionSteps: [
      { step: 1, name: 'Patient Information Collection', status: 'completed', time: '2 mins' },
      { step: 2, name: 'Medical History Review', status: 'completed', time: '5 mins' },
      { step: 3, name: 'AI-Powered Data Validation', status: 'completed', time: '3 mins' },
      { step: 4, name: 'Generate Summary Report', status: 'completed', time: '2 mins' },
    ],
  };

  const handlePauseResume = () => {
    // Mock action
    alert(workflow.status === 'active' ? 'Workflow paused' : 'Workflow resumed');
  };

  const handleRunNow = () => {
    // Mock action
    alert('Workflow started manually');
  };

  const handleDryRun = () => {
    setShowDryRun(true);
  };

  const getRunStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Link to="/workflows" className="text-gray-400 hover:text-gray-600">
                ← Back
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-3xl font-bold text-gray-900">{workflow.name}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  workflow.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {workflow.status}
              </span>
            </div>
            <p className="text-gray-600">
              Based on:{' '}
              <Link to={`/plans/1`} className="text-blue-600 hover:text-blue-700">
                {workflow.planTitle}
              </Link>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDryRun}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Dry Run
            </button>
            <button
              onClick={handlePauseResume}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              {workflow.status === 'active' ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={handleRunNow}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Run Now
            </button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Total Runs</p>
          <p className="text-3xl font-bold text-gray-900">{workflow.totalRuns}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Success Rate</p>
          <p className="text-3xl font-bold text-green-600">{workflow.successRate}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Credits Used</p>
          <p className="text-3xl font-bold text-gray-900">{workflow.creditsUsed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Avg Time</p>
          <p className="text-3xl font-bold text-gray-900">{workflow.avgTimePerRun}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Next Run</p>
          <p className="text-lg font-bold text-blue-600">{workflow.nextRun}</p>
        </div>
      </div>

      {showDryRun && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dry Run Results</h3>
              <p className="text-sm text-gray-600">
                Simulated execution with fake data to preview output and estimate costs
              </p>
            </div>
            <button
              onClick={() => setShowDryRun(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="bg-white rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Estimated Duration</span>
              <span className="font-semibold text-gray-900">~12 minutes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Estimated Cost</span>
              <span className="font-semibold text-gray-900">~45 credits ($0.45)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Simulated Output</span>
              <button className="text-sm text-blue-600 hover:text-blue-700">View Sample</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Runs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Runs</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {workflow.recentRuns.map((run) => (
                  <div
                    key={run.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="font-mono text-sm text-gray-600">{run.id}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getRunStatusColor(
                              run.status
                            )}`}
                          >
                            {run.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Started {run.startedAt}</p>
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-700">
                        View Details
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <span className="ml-2 font-medium text-gray-900">{run.duration}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Credits:</span>
                        <span className="ml-2 font-medium text-gray-900">{run.creditsUsed}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Completed:</span>
                        <span className="ml-2 font-medium text-gray-900">{run.completedAt}</span>
                      </div>
                    </div>
                    {run.error && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        Error: {run.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Execution Trace */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Last Execution Trace</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {workflow.executionSteps.map((step) => (
                  <div key={step.step} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      ✓
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{step.name}</h4>
                        <span className="text-sm text-gray-500">{step.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Step {step.step} completed successfully</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Configuration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Configuration</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">AI Model</p>
                <p className="font-medium text-gray-900">{workflow.parameters.aiModel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Output Format</p>
                <p className="font-medium text-gray-900">{workflow.parameters.outputFormat}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Auto Submit</p>
                <p className="font-medium text-gray-900">
                  {workflow.parameters.autoSubmit ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Notify on Completion</p>
                <p className="font-medium text-gray-900">
                  {workflow.parameters.notifyOnCompletion ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
              Edit Configuration
            </button>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Schedule</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Daily at 9:00 AM</p>
                <p className="text-xs text-blue-700 mt-1">Monday - Friday</p>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
              Edit Schedule
            </button>
          </div>

          {/* Monitoring */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Monitoring</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                <span className="text-sm text-gray-900">All Systems Normal</span>
                <span className="text-green-600">✓</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
              View Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
