import { useState, useEffect } from 'react';

// Mock data for the "Promptions" pattern - Dynamic UI generation
const MOCK_PROMPTIONS = {
  default: [
    { id: 'p1', label: 'HIPAA Compliant', type: 'checkbox' },
    { id: 'p2', label: 'FDA Compliant', type: 'checkbox' },
    { id: 'p3', label: 'Budget < $100', type: 'checkbox' },
    { id: 'p4', label: 'Human-in-the-loop', type: 'checkbox' },
  ],
  intake: [
    { id: 'i1', label: 'OCR / Scan support', type: 'checkbox' },
    { id: 'i2', label: 'EMR Integration', type: 'checkbox' },
    { id: 'i3', label: 'Mobile Friendly', type: 'checkbox' },
    { id: 'i4', label: 'Multi-language', type: 'checkbox' },
  ],
  notes: [
    { id: 'n1', label: 'Specialty Specific', type: 'checkbox' },
    { id: 'n2', label: 'Voice/Dictation', type: 'checkbox' },
    { id: 'n3', label: 'Citation Required', type: 'checkbox' },
    { id: 'n4', label: 'Auto-Attestation', type: 'checkbox' },
  ],
  auth: [
    { id: 'a1', label: 'Insurance Specific', type: 'checkbox' },
    { id: 'a2', label: 'Attachment Support', type: 'checkbox' },
    { id: 'a3', label: 'Appeal Generation', type: 'checkbox' },
  ]
};

export const SolutionSearch = () => {
  const [query, setQuery] = useState('');
  const [activePromptions, setActivePromptions] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<string | null>(null);

  // "AI" Logic to generate Promptions based on text
  useEffect(() => {
    const lowerQuery = query.toLowerCase();
    let nextPromptions = MOCK_PROMPTIONS.default;
    
    if (lowerQuery.includes('intake') || lowerQuery.includes('form') || lowerQuery.includes('patient')) {
        nextPromptions = MOCK_PROMPTIONS.intake;
    } else if (lowerQuery.includes('note') || lowerQuery.includes('chart') || lowerQuery.includes('document')) {
        nextPromptions = MOCK_PROMPTIONS.notes;
    } else if (lowerQuery.includes('auth') || lowerQuery.includes('insurance') || lowerQuery.includes('approval')) {
        nextPromptions = MOCK_PROMPTIONS.auth;
    }

    // Only update if we have enough text
    if (query.length > 3) {
        setActivePromptions(nextPromptions);
    } else {
        setActivePromptions([]);
        setResults(null);
    }
  }, [query]);

  // "AI" Logic to generate Response based on Query + Options
  useEffect(() => {
    if (query.length < 4) return;

    // Simulate processing delay for realism
    const timer = setTimeout(() => {
      generateResponse();
    }, 300);
    return () => clearTimeout(timer);
  }, [query, selectedOptions, activePromptions]);

  const generateResponse = () => {
    const context = Object.entries(selectedOptions)
      .filter(([_, val]) => val)
      .map(([key]) => activePromptions.find(p => p.id === key)?.label)
      .filter(Boolean)
      .join(', ');

    let baseResponse = "Please describe the workflow you need help with.";
    
    if (activePromptions === MOCK_PROMPTIONS.intake) {
        baseResponse = "Recommended Workflow: Automated Patient Intake.";
        if (selectedOptions['i1']) baseResponse += "\n\nTool: OCR-Scanner-Pro\nFeatures: Extracts text from paper forms automatically.";
        if (selectedOptions['i2']) baseResponse += "\n\nIntegration: Epic/Cerner Connector\nFeatures: Direct write-back to patient chart.";
        if (selectedOptions['i4']) baseResponse += "\n\nModule: Polyglot-AI\nFeatures: Real-time translation for 50+ languages.";
    } else if (activePromptions === MOCK_PROMPTIONS.notes) {
        baseResponse = "Recommended Workflow: AI Scribe & Documentation Assistant.";
        if (selectedOptions['n1']) baseResponse += "\n\nTemplate Pack: Surgical Specialty Suite (Plastic, Ortho, Neuro).";
        if (selectedOptions['n2']) baseResponse += "\n\nTool: Ambient-Voice-Capture\nFeatures: Records and transcribes visits securely.";
        if (selectedOptions['n3']) baseResponse += "\n\nFeature: Evidence-Based Citations\nFeatures: Links claims to PubMed/Guidelines.";
    } else if (activePromptions === MOCK_PROMPTIONS.auth) {
        baseResponse = "Recommended Workflow: Prior Authorization Generator.";
        if (selectedOptions['a1']) baseResponse += "\n\nDatabase: Payer-Specific Rules Engine (Aetna, UHC, BCBS).";
        if (selectedOptions['a3']) baseResponse += "\n\nModule: Denial Defender\nFeatures: Generates appeal letters based on denial codes.";
    } else if (activePromptions === MOCK_PROMPTIONS.default && query.length > 3) {
        baseResponse = "I can help you find the right AI tools. Try searching for 'patient intake', 'clinical notes', or 'prior authorization'.";
    }

    setResults(context ? `Selected Filters: [${context}] \n\n${baseResponse}` : baseResponse);
  };

  const toggleOption = (id: string) => {
    setSelectedOptions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 font-sans">
      <div className="text-center space-y-3 mb-10">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">AI Workflow Assistant</h2>
        <p className="text-slate-500 text-lg">Describe your clinical need to find the perfect AI solution</p>
      </div>

      {/* Main Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-6 w-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-5 border-2 border-slate-200 rounded-xl leading-6 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm text-lg"
          placeholder="e.g., 'automate patient intake', 'write clinical notes', 'prior auth help'..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Workflow Search"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 min-h-[400px]">
        {/* Promptions Panel (Left/Top) - The "Pattern" */}
        {activePromptions.length > 0 ? (
          <div className="md:col-span-4 space-y-4 animate-fade-in">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 h-full shadow-inner">
              <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                Refine Requirements
              </h3>
              <div className="space-y-3">
                {activePromptions.map((p) => (
                  <label key={p.id} className={`flex items-center p-3 rounded-lg border-2 transition-all cursor-pointer select-none ${selectedOptions[p.id] ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-[1.02]' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'}`}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={!!selectedOptions[p.id]}
                      onChange={() => toggleOption(p.id)}
                    />
                    <span className="flex-1 font-medium">{p.label}</span>
                    {selectedOptions[p.id] && (
                        <svg className="w-5 h-5 ml-2 animate-in fade-in zoom-in duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    )}
                  </label>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-400 text-center">
                Select features to refine recommended tools.
              </p>
            </div>
          </div>
        ) : (
            <div className="md:col-span-4 flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-xl h-full">
                <span className="text-sm">Requirements context will appear here</span>
            </div>
        )}

        {/* Results Panel (Right/Bottom) */}
        <div className="md:col-span-8">
            <div className={`bg-white border rounded-xl p-8 h-full transition-all duration-300 ${activePromptions.length > 0 ? 'border-indigo-100 shadow-xl shadow-indigo-100/50' : 'border-slate-200 shadow-sm'}`}>
                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center border-b border-slate-100 pb-4">
                    <svg className={`w-6 h-6 mr-3 ${activePromptions.length > 0 ? 'text-indigo-500' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    Recommended Solutions
                </h3>
                <div className="prose prose-slate max-w-none">
                    {results ? (
                        <div className="whitespace-pre-wrap text-slate-600 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {results}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-slate-400 space-y-3">
                            <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                            <p>Describe a task to see AI solutions</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};