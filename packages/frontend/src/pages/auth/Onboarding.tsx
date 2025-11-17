import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: 1, name: 'Professional Info' },
  { id: 2, name: 'Specialty' },
  { id: 3, name: 'HIPAA Acknowledgment' },
  { id: 4, name: 'Complete' },
];

const specialties = [
  'Plastic Surgery',
  'Orthopedic Surgery',
  'General Surgery',
  'Neurosurgery',
  'ENT (Otolaryngology)',
  'Cardiology',
  'Internal Medicine',
  'Other',
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    legalName: '',
    role: 'clinician',
    specialty: '',
    hipaaAcknowledged: false,
  });
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Legal Name
                  </label>
                  <input
                    type="text"
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dr. Jane Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="clinician">Clinician</option>
                    <option value="org_admin">Organization Administrator</option>
                    <option value="collaborator">Collaborator</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Your Specialty</h3>
              <p className="text-sm text-gray-600 mb-4">
                This helps us provide tailored AI templates and workflows for your practice.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => setFormData({ ...formData, specialty })}
                    className={`p-3 border-2 rounded-lg text-left transition-all ${
                      formData.specialty === specialty
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-900">{specialty}</span>
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">HIPAA Acknowledgment</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4 max-h-96 overflow-y-auto">
                <h4 className="font-semibold text-gray-900">HIPAA Compliance & Data Security</h4>
                <p className="text-sm text-gray-700">
                  Athen AI is designed with HIPAA compliance at its core. By using this platform, you acknowledge that:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                  <li>All data transmitted through the platform is encrypted in transit and at rest</li>
                  <li>PHI (Protected Health Information) handling requires explicit flagging during file uploads</li>
                  <li>You are responsible for ensuring data uploaded is appropriately classified</li>
                  <li>De-identification processes will be applied before any data sharing or vectorization</li>
                  <li>Audit logs are maintained for all data access and modifications</li>
                  <li>You agree not to use the platform for activities that violate HIPAA regulations</li>
                  <li>Original PHI-containing files are deleted after vectorization (only de-identified vectors retained)</li>
                </ul>
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-gray-700">
                    <strong>Important:</strong> If you mark data as "non-PHI," you accept full responsibility for ensuring no PHI is present. Misclassification may result in HIPAA violations.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-start">
                <input
                  id="hipaa-acknowledge"
                  type="checkbox"
                  checked={formData.hipaaAcknowledged}
                  onChange={(e) => setFormData({ ...formData, hipaaAcknowledged: e.target.checked })}
                  className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hipaa-acknowledge" className="ml-2 block text-sm text-gray-900">
                  I have read and acknowledge the HIPAA compliance requirements and data security policies
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-5xl">✓</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Athen AI!</h3>
              <p className="text-gray-600">
                Your account is ready. Let's create your first AI-powered workflow.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Connect your OpenAI account</li>
                <li>✓ Use the Planner to create your first workflow</li>
                <li>✓ Upload reference documents (with PHI de-identification)</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.legalName && formData.role;
      case 2:
        return formData.specialty;
      case 3:
        return formData.hipaaAcknowledged;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {steps.map((step, stepIdx) => (
                <li
                  key={step.name}
                  className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20 flex-1' : ''}`}
                >
                  <div className="flex items-center">
                    <div
                      className={`relative flex items-center justify-center w-10 h-10 rounded-full ${
                        step.id <= currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step.id < currentStep ? '✓' : step.id}
                    </div>
                    <span
                      className={`ml-4 text-sm font-medium ${
                        step.id <= currentStep ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {stepIdx !== steps.length - 1 && (
                    <div className="absolute top-5 left-10 w-full">
                      <div
                        className={`h-0.5 ${
                          step.id < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-6 py-2 rounded-md text-sm font-medium ${
                canProceed()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentStep === steps.length ? 'Get Started' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
