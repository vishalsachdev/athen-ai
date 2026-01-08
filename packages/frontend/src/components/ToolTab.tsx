import { useState, useEffect, useRef } from 'react';
import { getToolById } from '../data/tools';
import { getGuideByToolId, Guide } from '../data/guides';
import { useToolbox } from '../context/ToolboxContext';

interface ToolTabProps {
  toolId: string;
}

export function ToolTab({ toolId }: ToolTabProps) {
  const tool = getToolById(toolId);
  const guide = getGuideByToolId(toolId);

  if (!tool) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Tool Not Found</h3>
          <p className="text-slate-500 text-sm">The tool you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="h-full flex flex-col p-8">
        <ToolHeader tool={tool} />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 max-w-md">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 rounded-full p-3">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800 mb-2">Setup Guide Coming Soon</h3>
                <p className="text-amber-700 text-sm mb-4">
                  We're working on a detailed step-by-step setup guide for {tool.name}.
                </p>
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-amber-800 hover:text-amber-900 font-medium"
                >
                  Visit Website
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <ToolIntegrationFlow tool={tool} guide={guide} />;
}

function ToolHeader({ tool }: { tool: NonNullable<ReturnType<typeof getToolById>> }) {
  return (
    <div className="border-b border-slate-200 px-6 py-4 bg-slate-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-800">{tool.name}</h2>
          <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {tool.category === 'specialty' ? tool.subcategory : tool.category}
          </span>
          {tool.hipaaCompliant && (
            <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              HIPAA Compliant
            </span>
          )}
        </div>
        <a
          href={tool.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          Visit Website
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function ToolIntegrationFlow({ tool, guide }: { tool: NonNullable<ReturnType<typeof getToolById>>; guide: Guide }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [prerequisitesChecked, setPrerequisitesChecked] = useState<boolean[]>(
    new Array(guide.prerequisites.length).fill(false)
  );
  const { addTool, isToolInToolbox } = useToolbox();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Early return if tool is undefined (shouldn't happen but TypeScript safety)
  if (!tool) return null;

  // Load progress from localStorage
  useEffect(() => {
    const storageKey = `athen-tool-progress-${tool.id}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const progress = JSON.parse(saved);
        setCurrentStep(progress.lastActiveStep || 0);
        setCompletedSteps(progress.completedSteps || []);
        if (progress.prerequisitesChecked) {
          setPrerequisitesChecked(progress.prerequisitesChecked);
        }
      }
    } catch (e) {
      console.error('Failed to load tool progress:', e);
    }
  }, [tool.id]);

  // Save progress to localStorage
  useEffect(() => {
    const storageKey = `athen-tool-progress-${tool.id}`;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          lastActiveStep: currentStep,
          completedSteps,
          prerequisitesChecked,
        })
      );
    } catch (e) {
      console.error('Failed to save tool progress:', e);
    }
  }, [tool.id, currentStep, completedSteps, prerequisitesChecked]);

  const totalSteps = guide.steps.length;
  const allPrerequisitesChecked = prerequisitesChecked.every(Boolean);
  const canStartSteps = allPrerequisitesChecked;

  const togglePrerequisite = (index: number) => {
    setPrerequisitesChecked(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const scrollToTop = () => {
    // Scroll the scrollable container to top
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Scroll to top whenever step changes (except initial load)
  useEffect(() => {
    if (currentStep > 0) {
      // Use setTimeout to ensure DOM has updated
      const timer = setTimeout(() => {
        scrollToTop();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartSetup = () => {
    if (canStartSteps) {
      setCurrentStep(1);
    }
  };

  // Consider setup complete when on the last step
  const allStepsComplete = currentStep === totalSteps;

  return (
    <div className="h-full flex flex-col">
      <ToolHeader tool={tool} />

      {/* Step Content */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overscroll-contain">
        {currentStep === 0 ? (
          <PrerequisitesStep
            prerequisites={guide.prerequisites}
            checked={prerequisitesChecked}
            onToggle={togglePrerequisite}
            overview={guide.overview}
            onComplete={handleStartSetup}
          />
        ) : (
          <SetupStep
            step={guide.steps[currentStep - 1]}
            stepNumber={currentStep}
            onNext={currentStep < totalSteps ? nextStep : undefined}
            onPrev={prevStep}
            isLastStep={currentStep === totalSteps}
            allStepsComplete={allStepsComplete}
            tool={tool}
            isInToolbox={isToolInToolbox(tool.id)}
            onAddToToolbox={() => addTool(tool)}
          />
        )}
      </div>
    </div>
  );
}

function PrerequisitesStep({
  prerequisites,
  checked,
  onToggle,
  overview,
  onComplete,
}: {
  prerequisites: string[];
  checked: boolean[];
  onToggle: (index: number) => void;
  overview: string;
  onComplete: () => void;
}) {
  const allChecked = checked.every(Boolean);

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-3">Before You Start</h3>
          <p className="text-slate-600 leading-relaxed">{overview}</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Prerequisites</h4>
          <div className="space-y-3">
            {prerequisites.map((prereq, index) => (
              <label
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-white"
                style={{
                  borderColor: checked[index] ? 'rgb(99, 102, 241)' : 'rgb(226, 232, 240)',
                  backgroundColor: checked[index] ? 'rgb(238, 242, 255)' : 'transparent',
                }}
              >
                <input
                  type="checkbox"
                  checked={checked[index]}
                  onChange={() => onToggle(index)}
                  className="mt-0.5 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
                />
                <span className="text-sm text-slate-700 flex-1">{prereq}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={onComplete}
          disabled={!allChecked}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            allChecked
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          I'm Ready to Start Setup
        </button>
      </div>
    </div>
  );
}

function SetupStep({
  step,
  stepNumber,
  onNext,
  onPrev,
  isLastStep,
  allStepsComplete,
  tool,
  isInToolbox,
  onAddToToolbox,
}: {
  step: { title: string; content: string; tip?: string };
  stepNumber: number;
  onNext?: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  allStepsComplete: boolean;
  tool: NonNullable<ReturnType<typeof getToolById>>;
  isInToolbox: boolean;
  onAddToToolbox: () => void;
}) {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        {/* Step Header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
              stepNumber === 1
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {stepNumber}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-800">{step.title}</h3>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
          <div className="prose prose-slate prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">{step.content}</div>
          </div>

          {/* Screenshot Placeholder */}
          <div className="mt-6 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-12 text-center">
            <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-slate-500">Screenshot placeholder for this step</p>
          </div>

          {step.tip && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-medium text-blue-800">Tip: </span>
                  <span className="text-blue-700">{step.tip}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Completion Step */}
        {isLastStep && allStepsComplete && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 rounded-full p-3">
                <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-emerald-800 mb-2">Setup Complete!</h4>
                <p className="text-emerald-700 text-sm mb-4">
                  You've successfully set up {tool?.name}. You can now start using it in your toolbox.
                </p>
                {!isInToolbox && tool && (
                  <button
                    onClick={onAddToToolbox}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    Add to Toolbox
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onPrev}
            disabled={stepNumber === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              stepNumber === 1
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Previous
          </button>

          {onNext && (
            <button
              onClick={onNext}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Next Step
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

