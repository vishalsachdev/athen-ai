import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PlanFormData {
  goal: string;
  specialty: string;
  phiUsage: 'yes' | 'no' | '';
  hipaaCompliance: 'required' | 'not-required' | '';
  budget: string;
  teamSize: string;
  urgency: string;
  integrations: string[];
}

const specialties = [
  'Plastic Surgery',
  'Orthopedic Surgery',
  'General Surgery',
  'Neurosurgery',
  'ENT',
  'Other',
];

const urgencyOptions = [
  { value: 'immediate', label: 'Immediate (< 1 week)', icon: '🔥' },
  { value: 'soon', label: 'Soon (1-4 weeks)', icon: '⚡' },
  { value: 'planned', label: 'Planned (> 1 month)', icon: '📅' },
];

const integrationOptions = [
  'Electronic Health Records (EHR)',
  'Practice Management System',
  'Document Storage (Google Drive, Dropbox)',
  'Email',
  'Calendar',
  'Other',
];

export default function Planner() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<PlanFormData>({
    goal: '',
    specialty: '',
    phiUsage: '',
    hipaaCompliance: '',
    budget: '',
    teamSize: '',
    urgency: '',
    integrations: [],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const navigate = useNavigate();

  const totalSteps = 7;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleGeneratePlan();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleGeneratePlan = () => {
    setIsGenerating(true);
    // Simulate API call to generate plan
    setTimeout(() => {
      setGeneratedPlan({
        title: `${formData.goal} - AI Workflow`,
        summary: `An AI-powered workflow for ${formData.goal} tailored for ${formData.specialty}`,
        estimatedTime: '15 mins',
        estimatedCost: '50 credits',
        steps: [
          {
            id: 1,
            title: 'Data Collection',
            description: 'Gather patient information and relevant documents',
            toolId: 'document-parser',
            estimatedCost: '10 credits',
          },
          {
            id: 2,
            title: 'AI Processing',
            description: 'Process data using GPT-4 to generate initial draft',
            toolId: 'openai-gpt4',
            estimatedCost: '25 credits',
          },
          {
            id: 3,
            title: 'Review & Validation',
            description: 'Review AI-generated content and make necessary adjustments',
            toolId: 'manual-review',
            estimatedCost: '0 credits',
          },
          {
            id: 4,
            title: 'Export & Integration',
            description: 'Export final output to your EHR or clipboard',
            toolId: 'export-tool',
            estimatedCost: '5 credits',
          },
        ],
        recommendations: [
          'Connect OpenAI for GPT-4 access',
          'Upload relevant templates or past examples',
          'Set up de-identification for PHI handling',
        ],
        risks: [
          'Ensure all PHI is properly flagged and de-identified',
          'Manual review required before inserting into patient records',
        ],
      });
      setIsGenerating(false);
    }, 2000);
  };

  const handleToggleIntegration = (integration: string) => {
    setFormData({
      ...formData,
      integrations: formData.integrations.includes(integration)
        ? formData.integrations.filter((i) => i !== integration)
        : [...formData.integrations, integration],
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.goal.length > 0;
      case 2:
        return formData.specialty.length > 0;
      case 3:
        return formData.phiUsage !== '';
      case 4:
        return formData.hipaaCompliance !== '';
      case 5:
        return formData.budget.length > 0;
      case 6:
        return formData.urgency !== '';
      case 7:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    if (generatedPlan) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{generatedPlan.title}</h2>
            <p className="text-gray-600">{generatedPlan.summary}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Estimated Time</p>
              <p className="text-lg font-semibold text-gray-900">{generatedPlan.estimatedTime}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Estimated Cost</p>
              <p className="text-lg font-semibold text-gray-900">{generatedPlan.estimatedCost}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Workflow Steps</h3>
            <div className="space-y-4">
              {generatedPlan.steps.map((step: any, index: number) => (
                <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {step.toolId}
                        </span>
                        <span className="text-xs text-gray-500">{step.estimatedCost}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">📋 Recommendations</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              {generatedPlan.recommendations.map((rec: string, index: number) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">⚠️ Important Considerations</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              {generatedPlan.risks.map((risk: string, index: number) => (
                <li key={index}>• {risk}</li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => {
                setGeneratedPlan(null);
                setStep(1);
              }}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Start Over
            </button>
            <button
              onClick={() => navigate('/plans')}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Save Plan
            </button>
          </div>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-2">
                What do you want to accomplish?
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Describe your goal in a few words (e.g., "Generate SOAP notes", "Create patient instructions")
              </p>
              <textarea
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Example: Automate prior authorization packet preparation for orthopedic surgeries"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-2">
                What is your specialty?
              </label>
              <p className="text-sm text-gray-600 mb-4">
                This helps us tailor the workflow to your specific needs
              </p>
              <div className="grid grid-cols-2 gap-3">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => setFormData({ ...formData, specialty })}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.specialty === specialty
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-2">
                Will this workflow involve PHI (Protected Health Information)?
              </label>
              <p className="text-sm text-gray-600 mb-4">
                PHI includes any patient-identifiable information
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setFormData({ ...formData, phiUsage: 'yes' })}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    formData.phiUsage === 'yes'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">Yes, involves PHI</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Full HIPAA compliance and de-identification will be applied
                  </div>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, phiUsage: 'no' })}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    formData.phiUsage === 'no'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">No PHI involved</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Lighter compliance requirements (you accept responsibility for accuracy)
                  </div>
                </button>
              </div>
              {formData.phiUsage === 'no' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    ⚠️ By selecting "No PHI," you accept full responsibility for ensuring no PHI is present. Misclassification may result in HIPAA violations.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-2">
                HIPAA/FDA Compliance Requirements
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Do you need to maintain HIPAA compliance for this workflow?
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setFormData({ ...formData, hipaaCompliance: 'required' })}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    formData.hipaaCompliance === 'required'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">HIPAA Compliance Required</div>
                  <div className="text-sm text-gray-600 mt-1">
                    All data will be encrypted and audit logs maintained
                  </div>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, hipaaCompliance: 'not-required' })}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    formData.hipaaCompliance === 'not-required'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">Not Required</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Standard security measures will be applied
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-2">
                What is your monthly budget?
              </label>
              <p className="text-sm text-gray-600 mb-4">
                This helps us recommend cost-effective tools (1 credit = $0.01)
              </p>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., $50/month (5,000 credits)"
              />
              <div className="mt-4 grid grid-cols-3 gap-3">
                {['$25/month', '$50/month', '$100/month'].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setFormData({ ...formData, budget: amount })}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-2">
                How urgently do you need this workflow?
              </label>
              <p className="text-sm text-gray-600 mb-4">
                This helps us prioritize setup steps and recommendations
              </p>
              <div className="space-y-3">
                {urgencyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, urgency: option.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      formData.urgency === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{option.icon}</span>
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-2">
                What integrations do you need?
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Select all that apply
              </p>
              <div className="space-y-2">
                {integrationOptions.map((integration) => (
                  <label
                    key={integration}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.integrations.includes(integration)}
                      onChange={() => handleToggleIntegration(integration)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-gray-900">{integration}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Plan...</h2>
          <p className="text-gray-600">
            Our AI is analyzing your requirements and creating a customized workflow
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Planner</h1>
        <p className="text-gray-600">
          Answer a few questions and we'll generate a customized AI workflow for you
        </p>
      </div>

      {!generatedPlan && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round((step / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8">
        {renderStep()}

        {!generatedPlan && (
          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`px-6 py-3 border border-gray-300 rounded-lg font-medium ${
                step === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-6 py-3 rounded-lg font-medium ${
                canProceed()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {step === totalSteps ? 'Generate Plan' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
