import { useState } from 'react';

interface Connection {
  id: string;
  provider: string;
  name: string;
  status: 'connected' | 'expired' | 'error';
  scope: string[];
  lastValidated: string;
  tier: string;
  estimatedMonthlyCost: string;
}

interface Provider {
  id: string;
  name: string;
  logo: string;
  description: string;
  authType: 'oauth' | 'api_key';
  hipaaCompliant: boolean;
  mvpSupported: boolean;
}

export default function Connections() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [apiKey, setApiKey] = useState('');

  // Mock data
  const connections: Connection[] = [
    {
      id: '1',
      provider: 'openai',
      name: 'OpenAI - Personal',
      status: 'connected',
      scope: ['models.gpt-4', 'models.gpt-3.5-turbo', 'embeddings'],
      lastValidated: '2 hours ago',
      tier: 'Pay-as-you-go',
      estimatedMonthlyCost: '$45-60/month',
    },
    {
      id: '2',
      provider: 'openai',
      name: 'OpenAI - Organization',
      status: 'connected',
      scope: ['models.gpt-4', 'embeddings'],
      lastValidated: '1 day ago',
      tier: 'Enterprise',
      estimatedMonthlyCost: '$200-250/month',
    },
  ];

  const availableProviders: Provider[] = [
    {
      id: 'openai',
      name: 'OpenAI',
      logo: '🤖',
      description: 'GPT-4, GPT-3.5, and embeddings for AI-powered workflows',
      authType: 'api_key',
      hipaaCompliant: true,
      mvpSupported: true,
    },
    {
      id: 'google',
      name: 'Google (Gemini)',
      logo: '🔷',
      description: 'Google Gemini for multimodal AI capabilities',
      authType: 'oauth',
      hipaaCompliant: true,
      mvpSupported: true,
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      logo: '⚡',
      description: 'Claude for advanced reasoning and analysis',
      authType: 'api_key',
      hipaaCompliant: true,
      mvpSupported: false,
    },
  ];

  const handleAddConnection = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowAddModal(true);
  };

  const handleConnectOAuth = () => {
    // Mock OAuth flow
    alert('Opening OAuth flow...');
    setShowAddModal(false);
  };

  const handleConnectAPIKey = () => {
    if (!apiKey) {
      alert('Please enter an API key');
      return;
    }
    // Mock API key connection
    alert('Testing connection...');
    setTimeout(() => {
      alert('Connection successful!');
      setShowAddModal(false);
      setApiKey('');
    }, 1000);
  };

  const handleTestConnection = (_connectionId: string) => {
    alert('Testing connection...');
    setTimeout(() => {
      alert('Connection test successful!');
    }, 1000);
  };

  const handleDeleteConnection = (_connectionId: string) => {
    if (confirm('Are you sure you want to delete this connection?')) {
      alert('Connection deleted');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Connections</h1>
        <p className="text-gray-600 mt-1">Connect AI tools and services to power your workflows</p>
      </div>

      {/* Active Connections */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Active Connections</h2>
        </div>
        <div className="p-6">
          {connections.length > 0 ? (
            <div className="space-y-4">
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">🤖</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{connection.name}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              connection.status
                            )}`}
                          >
                            {connection.status}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            HIPAA ✓
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Last validated {connection.lastValidated}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {connection.scope.map((scope) => (
                            <span
                              key={scope}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {scope}
                            </span>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Tier:</span>
                            <span className="ml-2 font-medium text-gray-900">{connection.tier}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Est. Monthly Cost:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {connection.estimatedMonthlyCost}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTestConnection(connection.id)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Test
                      </button>
                      <button
                        onClick={() => handleDeleteConnection(connection.id)}
                        className="px-3 py-2 border border-red-300 rounded-lg text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔌</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No connections yet</h3>
              <p className="text-gray-600">Connect your first AI service to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Available Providers */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Available Providers</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableProviders.map((provider) => (
              <div
                key={provider.id}
                className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">{provider.logo}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{provider.name}</h3>
                  <p className="text-sm text-gray-600">{provider.description}</p>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    {provider.hipaaCompliant && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        HIPAA ✓
                      </span>
                    )}
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {provider.authType === 'oauth' ? 'OAuth' : 'API Key'}
                    </span>
                  </div>
                  {!provider.mvpSupported && (
                    <div className="text-center">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Post-MVP
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleAddConnection(provider)}
                  disabled={!provider.mvpSupported}
                  className={`w-full py-2 rounded-lg font-medium ${
                    provider.mvpSupported
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {provider.mvpSupported ? 'Connect' : 'Coming Soon'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connection Modal */}
      {showAddModal && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{selectedProvider.logo}</span>
                  <h2 className="text-2xl font-bold text-gray-900">Connect {selectedProvider.name}</h2>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-600 mb-4">{selectedProvider.description}</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Connection Details</h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• This connection will be encrypted and stored securely</li>
                    <li>• You can manage multiple connections to the same provider</li>
                    <li>• Cost estimates are based on typical usage patterns</li>
                    {selectedProvider.hipaaCompliant && <li>• HIPAA-compliant with BAA in place</li>}
                  </ul>
                </div>
              </div>

              {selectedProvider.authType === 'api_key' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Your API key will be encrypted before storage
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Connection Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Personal, Work, Testing"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      You'll be redirected to {selectedProvider.name} to authorize this connection. Make sure to allow the requested permissions.
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Required Scopes:</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Read access to models</li>
                      <li>• Create and manage API calls</li>
                      <li>• Access usage and billing information</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    selectedProvider.authType === 'oauth'
                      ? handleConnectOAuth
                      : handleConnectAPIKey
                  }
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  {selectedProvider.authType === 'oauth' ? 'Continue to OAuth' : 'Test & Connect'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
