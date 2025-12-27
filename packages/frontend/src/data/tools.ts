export type PainPoint = 'documentation' | 'patient-questions' | 'scheduling' | 'intake' | 'billing';
export type SetupDifficulty = 'easy' | 'medium' | 'hard';
export type PricingTier = 'free' | 'low' | 'medium' | 'enterprise';

export interface Tool {
  id: string;
  name: string;
  category: 'scribe' | 'intake' | 'chatbot' | 'scheduling' | 'billing' | 'specialty';
  subcategory?: string;
  description: string;
  website: string;
  hipaaCompliant: boolean;
  pricing: string;
  pricingTier: PricingTier;
  bestFor: string;
  keyFeatures: string[];
  keywords: string[];
  painPoints: PainPoint[];
  setupDifficulty: SetupDifficulty;
  setupTime: string;
  specialties?: string[]; // which specialties this is good for
}

export const tools: Tool[] = [
  // === SCRIBES ===
  {
    id: 'freed-ai',
    name: 'Freed AI',
    category: 'scribe',
    description: 'AI medical scribe that listens to patient encounters and auto-generates clinical notes. Adapts to each clinician\'s style.',
    website: 'https://www.getfreed.ai/',
    hipaaCompliant: true,
    pricing: 'Freemium; paid plans available',
    pricingTier: 'low',
    bestFor: 'Clinics with 2-50 clinicians',
    keyFeatures: [
      'No patient recording storage',
      'Works on any device',
      'Sets up in minutes, no IT required',
      'Customizable templates'
    ],
    keywords: ['scribe', 'documentation', 'notes', 'charting', 'dictation', 'voice'],
    painPoints: ['documentation'],
    setupDifficulty: 'easy',
    setupTime: '10-15 minutes',
    specialties: ['plastic-surgery', 'dermatology', 'orthopedics', 'general']
  },
  {
    id: 'scribeberry',
    name: 'Scribeberry',
    category: 'scribe',
    description: 'AI scribe with 99.9% accuracy that auto-generates structured notes for any EMR. Also includes patient intake agents.',
    website: 'https://www.scribeberry.com/',
    hipaaCompliant: true,
    pricing: 'Subscription-based',
    pricingTier: 'medium',
    bestFor: 'Practices wanting high accuracy',
    keyFeatures: [
      '99.9% accuracy claim',
      'Works with all EMRs',
      'Patient intake agents included',
      'Auto-fill forms'
    ],
    keywords: ['scribe', 'documentation', 'notes', 'charting', 'emr', 'intake'],
    painPoints: ['documentation', 'intake'],
    setupDifficulty: 'easy',
    setupTime: '15-20 minutes',
    specialties: ['plastic-surgery', 'dermatology', 'orthopedics', 'general']
  },
  {
    id: 'doximity-scribe',
    name: 'Doximity Scribe',
    category: 'scribe',
    description: 'Free AI clinical documentation tool from Doximity. Processes recordings in real-time and immediately discards audio.',
    website: 'https://blog.doximity.com/articles/meet-doximity-scribe',
    hipaaCompliant: true,
    pricing: 'FREE for all U.S. physicians, NPs, PAs, medical students',
    pricingTier: 'free',
    bestFor: 'Any physician with a Doximity account',
    keyFeatures: [
      'Completely free',
      'No audio storage',
      'Real-time processing',
      'BAA included for all Doximity users'
    ],
    keywords: ['scribe', 'documentation', 'notes', 'charting', 'free', 'doximity'],
    painPoints: ['documentation'],
    setupDifficulty: 'easy',
    setupTime: '5-10 minutes',
    specialties: ['plastic-surgery', 'dermatology', 'orthopedics', 'general']
  },

  // === INTAKE ===
  {
    id: 'intakeq',
    name: 'IntakeQ',
    category: 'intake',
    description: 'Healthcare-first intake forms with conditional logic, e-signatures, and EHR integration. HIPAA compliant by design.',
    website: 'https://intakeq.com/',
    hipaaCompliant: true,
    pricing: 'Starting ~$29/month',
    pricingTier: 'low',
    bestFor: 'Any healthcare practice needing custom intake workflows',
    keyFeatures: [
      'Drag-and-drop form builder',
      'Conditional logic',
      'E-signatures',
      'EHR integration',
      'Automated reminders'
    ],
    keywords: ['intake', 'forms', 'patient', 'registration', 'onboarding', 'questionnaire'],
    painPoints: ['intake'],
    setupDifficulty: 'medium',
    setupTime: '30-45 minutes',
    specialties: ['plastic-surgery', 'dermatology', 'orthopedics', 'general']
  },
  {
    id: 'jotform',
    name: 'Jotform (Healthcare)',
    category: 'intake',
    description: 'AI form generator + chatbot builder with HIPAA compliance option. 10,000+ templates available.',
    website: 'https://www.jotform.com/',
    hipaaCompliant: true,
    pricing: 'Free tier; paid from ~$34/month; 50% healthcare discount',
    pricingTier: 'low',
    bestFor: 'Practices wanting AI-generated forms',
    keyFeatures: [
      'AI form generation from descriptions',
      '10,000+ templates',
      'Chatbot agents',
      'HIPAA compliance on higher tiers'
    ],
    keywords: ['intake', 'forms', 'patient', 'ai', 'templates', 'chatbot'],
    painPoints: ['intake', 'patient-questions'],
    setupDifficulty: 'easy',
    setupTime: '15-30 minutes',
    specialties: ['plastic-surgery', 'dermatology', 'orthopedics', 'general']
  },
  {
    id: 'infermedica',
    name: 'Infermedica Intake',
    category: 'intake',
    description: 'AI-powered symptom collection and pre-visit intake. Intelligent algorithms ensure comprehensive symptom capture.',
    website: 'https://infermedica.com/solutions/intake',
    hipaaCompliant: true,
    pricing: 'Enterprise pricing',
    pricingTier: 'enterprise',
    bestFor: 'Practices wanting clinical-grade AI triage',
    keyFeatures: [
      'Intelligent symptom collection',
      'Reduces visit times (20 min to 12.5 min)',
      'Clinical decision support',
      'Pre-visit triage'
    ],
    keywords: ['intake', 'triage', 'symptoms', 'clinical', 'ai', 'pre-visit'],
    painPoints: ['intake'],
    setupDifficulty: 'hard',
    setupTime: '1-2 weeks (enterprise)',
    specialties: ['general']
  },

  // === CHATBOTS ===
  {
    id: 'kommunicate',
    name: 'Kommunicate',
    category: 'chatbot',
    description: 'AI chatbot builder that can be trained on your own documents. Includes bot-to-human handoff.',
    website: 'https://www.kommunicate.io/',
    hipaaCompliant: true,
    pricing: 'Starting ~$100/month',
    pricingTier: 'medium',
    bestFor: 'Practices wanting custom FAQ bots',
    keyFeatures: [
      'Train on your documents',
      'Custom branding',
      'Bot-to-human handoff',
      'Live agent dashboard'
    ],
    keywords: ['chatbot', 'faq', 'support', 'documents', 'train', 'custom'],
    painPoints: ['patient-questions'],
    setupDifficulty: 'medium',
    setupTime: '1-2 hours',
    specialties: ['plastic-surgery', 'dermatology', 'orthopedics', 'general']
  },
  {
    id: 'bastiongpt',
    name: 'BastionGPT',
    category: 'chatbot',
    description: 'HIPAA-compliant ChatGPT for healthcare. Secure version where data is not accessible to OpenAI or used for training.',
    website: 'https://bastiongpt.com/',
    hipaaCompliant: true,
    pricing: 'Subscription-based',
    pricingTier: 'medium',
    bestFor: 'Practices wanting ChatGPT capabilities with PHI safety',
    keyFeatures: [
      'Exceeds HIPAA requirements',
      'Data not used for OpenAI training',
      'Full GPT-4 capabilities',
      'Document analysis'
    ],
    keywords: ['chatbot', 'chatgpt', 'gpt', 'hipaa', 'secure', 'ai'],
    painPoints: ['patient-questions', 'documentation'],
    setupDifficulty: 'easy',
    setupTime: '10-15 minutes',
    specialties: ['plastic-surgery', 'dermatology', 'orthopedics', 'general']
  },

  // === SCHEDULING ===
  {
    id: 'nexhealth',
    name: 'NexHealth',
    category: 'scheduling',
    description: 'Patient experience platform with smart scheduling, automated reminders, and reviews management.',
    website: 'https://www.nexhealth.com/',
    hipaaCompliant: true,
    pricing: 'Contact for pricing',
    pricingTier: 'medium',
    bestFor: 'Dental, medical, and specialty practices',
    keyFeatures: [
      'Online booking',
      'Automated reminders',
      'Waitlist management',
      'EHR sync',
      'Review management'
    ],
    keywords: ['scheduling', 'appointments', 'booking', 'reminders', 'waitlist'],
    painPoints: ['scheduling'],
    setupDifficulty: 'medium',
    setupTime: '1-2 hours',
    specialties: ['plastic-surgery', 'dermatology', 'orthopedics', 'general']
  },
  {
    id: 'emitrr',
    name: 'Emitrr',
    category: 'scheduling',
    description: 'AI-powered scheduling with VoIP, automated reminders, and patient communication all-in-one.',
    website: 'https://emitrr.com/',
    hipaaCompliant: true,
    pricing: 'Affordable for small practices',
    pricingTier: 'low',
    bestFor: 'Small to medium practices wanting all-in-one communication',
    keyFeatures: [
      'AI chatbot',
      'Appointment scheduling',
      'Two-way texting',
      'VoIP calling',
      'Automated reminders'
    ],
    keywords: ['scheduling', 'appointments', 'communication', 'texting', 'voip', 'reminders'],
    painPoints: ['scheduling', 'patient-questions'],
    setupDifficulty: 'easy',
    setupTime: '30-45 minutes',
    specialties: ['plastic-surgery', 'dermatology', 'orthopedics', 'general']
  },

  // === BILLING ===
  {
    id: 'medical-coding-ai',
    name: 'Medical Coding AI',
    category: 'billing',
    description: 'GPT-based tool that translates medical reports into ICD-10, CPT, and HCPCS billing codes.',
    website: 'https://theresanaiforthat.com/gpt/medical-coding-ai/',
    hipaaCompliant: false,
    pricing: 'Requires ChatGPT Plus (~$20/month)',
    pricingTier: 'low',
    bestFor: 'Quick coding assistance (use with BastionGPT for HIPAA compliance)',
    keyFeatures: [
      'ICD-10 code lookup',
      'CPT code suggestions',
      'HCPCS support',
      'Medical report analysis'
    ],
    keywords: ['billing', 'coding', 'icd', 'cpt', 'insurance', 'claims'],
    painPoints: ['billing'],
    setupDifficulty: 'easy',
    setupTime: '5 minutes',
    specialties: ['plastic-surgery', 'dermatology', 'orthopedics', 'general']
  },

  // === SPECIALTY: PLASTIC SURGERY ===
  {
    id: 'touchmd',
    name: 'TouchMD',
    category: 'specialty',
    subcategory: 'Plastic Surgery',
    description: 'Consultation app with before/after simulation and patient education for plastic surgeons and aestheticians.',
    website: 'https://www.touchmd.com/',
    hipaaCompliant: true,
    pricing: 'Contact for pricing',
    pricingTier: 'medium',
    bestFor: 'Plastic surgeons, cosmetic practices',
    keyFeatures: [
      'iPad-based consultations',
      'Procedure visualization',
      'Before/after simulation',
      'Consent management',
      'Patient education'
    ],
    keywords: ['plastic surgery', 'cosmetic', 'consultation', 'simulation', 'before after'],
    painPoints: ['patient-questions'],
    setupDifficulty: 'medium',
    setupTime: '1-2 hours',
    specialties: ['plastic-surgery']
  },
  {
    id: 'aesthetix-crm',
    name: 'Aesthetix CRM',
    category: 'specialty',
    subcategory: 'Plastic Surgery',
    description: 'CRM for plastic surgeons with AI-powered lead management, intake automation, and marketing tools.',
    website: 'https://aesthetixcrm.com/',
    hipaaCompliant: true,
    pricing: 'Contact for pricing',
    pricingTier: 'medium',
    bestFor: 'Cosmetic surgery, dermatology, medical spas',
    keyFeatures: [
      'AI lead management',
      'Intake automation',
      'Marketing tools',
      'EMR integrations (ModMed, Nextech, 4D EMR)'
    ],
    keywords: ['plastic surgery', 'cosmetic', 'crm', 'leads', 'marketing', 'dermatology'],
    painPoints: ['intake', 'scheduling'],
    setupDifficulty: 'medium',
    setupTime: '2-4 hours',
    specialties: ['plastic-surgery', 'dermatology']
  },

  // === SPECIALTY: DERMATOLOGY ===
  {
    id: 'miiskin',
    name: 'Miiskin',
    category: 'specialty',
    subcategory: 'Dermatology',
    description: 'AI skin lesion analysis with patient photo documentation and change tracking over time.',
    website: 'https://miiskin.com/',
    hipaaCompliant: true,
    pricing: 'Contact for pricing',
    pricingTier: 'medium',
    bestFor: 'Dermatology practices',
    keyFeatures: [
      'AI lesion detection',
      'Patient photo documentation',
      'Change tracking over time',
      'Teledermatology support'
    ],
    keywords: ['dermatology', 'skin', 'lesion', 'mole', 'imaging', 'analysis'],
    painPoints: ['documentation'],
    setupDifficulty: 'medium',
    setupTime: '1-2 hours',
    specialties: ['dermatology']
  },
  {
    id: 'fotofinder',
    name: 'FotoFinder',
    category: 'specialty',
    subcategory: 'Dermatology',
    description: 'Clinical-grade total body mapping and AI lesion detection. Moleanalyzer pro validated at Heidelberg University.',
    website: 'https://www.fotofinder.de/en/',
    hipaaCompliant: true,
    pricing: 'Enterprise pricing',
    pricingTier: 'enterprise',
    bestFor: 'Dermatology practices needing clinical-grade imaging',
    keyFeatures: [
      'Total body mapping',
      'Moleanalyzer pro AI',
      'Dermoscopy integration',
      'Validated performance comparable to dermatologists'
    ],
    keywords: ['dermatology', 'skin', 'lesion', 'mole', 'imaging', 'body mapping', 'dermoscopy'],
    painPoints: ['documentation'],
    setupDifficulty: 'hard',
    setupTime: '1-2 weeks (enterprise)',
    specialties: ['dermatology']
  }
];

export const categories = [
  { id: 'scribe', label: 'AI Scribes', description: 'Reduce documentation time' },
  { id: 'intake', label: 'Patient Intake', description: 'Smart forms & questionnaires' },
  { id: 'chatbot', label: 'Chatbots', description: 'Train on your documents' },
  { id: 'scheduling', label: 'Scheduling', description: 'Appointments & reminders' },
  { id: 'billing', label: 'Billing & Coding', description: 'ICD-10, CPT assistance' },
  { id: 'specialty', label: 'Specialty Tools', description: 'Plastic surgery, dermatology' }
];

export const painPointLabels: Record<PainPoint, string> = {
  'documentation': 'I spend too much time on documentation',
  'patient-questions': 'Patients have questions I can\'t always answer quickly',
  'scheduling': 'Scheduling and appointments are a mess',
  'intake': 'Patient intake is tedious or paper-based',
  'billing': 'Billing and coding takes forever'
};

export const specialtyLabels: Record<string, string> = {
  'plastic-surgery': 'Plastic Surgery',
  'dermatology': 'Dermatology',
  'orthopedics': 'Orthopedics',
  'general': 'General Practice / Other'
};

export function searchTools(query: string, filters?: { hipaaOnly?: boolean; category?: string }): Tool[] {
  const lowerQuery = query.toLowerCase();

  let results = tools.filter(tool => {
    const matchesQuery =
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.keywords.some(kw => kw.includes(lowerQuery)) ||
      tool.category.includes(lowerQuery) ||
      (tool.subcategory?.toLowerCase().includes(lowerQuery) ?? false);

    return matchesQuery;
  });

  if (filters?.hipaaOnly) {
    results = results.filter(tool => tool.hipaaCompliant);
  }

  if (filters?.category) {
    results = results.filter(tool => tool.category === filters.category);
  }

  return results;
}

export function getToolById(id: string): Tool | undefined {
  return tools.find(tool => tool.id === id);
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter(tool => tool.category === category);
}

export interface WizardFilters {
  painPoint?: PainPoint;
  specialty?: string;
  pricingPreference?: 'free' | 'low' | 'any';
  easySetup?: boolean;
}

export function getRecommendedTools(filters: WizardFilters): Tool[] {
  let results = [...tools];

  // Filter by pain point
  if (filters.painPoint) {
    results = results.filter(tool => tool.painPoints.includes(filters.painPoint!));
  }

  // Filter by specialty
  if (filters.specialty && filters.specialty !== 'general') {
    results = results.filter(tool =>
      tool.specialties?.includes(filters.specialty!) ||
      tool.specialties?.includes('general')
    );
  }

  // Filter by pricing
  if (filters.pricingPreference === 'free') {
    results = results.filter(tool => tool.pricingTier === 'free');
  } else if (filters.pricingPreference === 'low') {
    results = results.filter(tool => tool.pricingTier === 'free' || tool.pricingTier === 'low');
  }

  // Filter by setup difficulty
  if (filters.easySetup) {
    results = results.filter(tool => tool.setupDifficulty === 'easy');
  }

  // Sort: HIPAA compliant first, then by setup difficulty
  results.sort((a, b) => {
    if (a.hipaaCompliant && !b.hipaaCompliant) return -1;
    if (!a.hipaaCompliant && b.hipaaCompliant) return 1;

    const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
    return difficultyOrder[a.setupDifficulty] - difficultyOrder[b.setupDifficulty];
  });

  return results.slice(0, 3); // Return top 3
}
