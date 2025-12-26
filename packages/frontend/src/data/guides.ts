export interface GuideStep {
  title: string;
  content: string;
  tip?: string;
}

export interface Guide {
  toolId: string;
  overview: string;
  timeEstimate: string;
  prerequisites: string[];
  steps: GuideStep[];
  tips: string[];
}

export const guides: Record<string, Guide> = {
  'doximity-scribe': {
    toolId: 'doximity-scribe',
    overview: 'Doximity Scribe is a free AI clinical documentation tool available to all verified U.S. physicians, NPs, PAs, and medical students. It listens to your patient encounters and generates clinical notes automatically.',
    timeEstimate: '5-10 minutes',
    prerequisites: [
      'Verified Doximity account (free to create)',
      'Smartphone or computer with microphone',
      'Active internet connection'
    ],
    steps: [
      {
        title: 'Verify Your Doximity Account',
        content: `If you don't have a Doximity account yet:

1. Go to doximity.com and click "Join"
2. Enter your NPI number or medical school information
3. Verify your identity (usually takes 24-48 hours)
4. Once verified, you'll have full access to Scribe

If you already have a Doximity account, make sure you're logged in.`,
        tip: 'Doximity verification is required because Scribe is only available to verified healthcare professionals.'
      },
      {
        title: 'Access Doximity Scribe',
        content: `There are two ways to access Scribe:

Option A: Web Browser
1. Go to doximity.com/scribe
2. Log in with your Doximity credentials
3. You'll see the Scribe interface ready to record

Option B: Doximity Mobile App
1. Download the Doximity app from App Store or Google Play
2. Log in to your account
3. Tap the "Scribe" icon in the navigation`,
        tip: 'The mobile app is convenient for in-person visits, while the web version works well for telehealth.'
      },
      {
        title: 'Configure Your Preferences',
        content: `Before your first recording, set up your preferences:

1. Click the Settings gear icon
2. Choose your default note type (SOAP, H&P, Progress Note, etc.)
3. Select your specialty for better note formatting
4. Set your preferred note length (concise, standard, detailed)
5. Choose whether to include ICD-10 code suggestions`,
        tip: 'You can change these settings for individual encounters, but setting good defaults saves time.'
      },
      {
        title: 'Record Your First Encounter',
        content: `When you're ready to document a patient visit:

1. Click the red Record button to start
2. Conduct your patient encounter normally
3. Speak naturally - Scribe captures both you and the patient
4. Click Stop when the encounter is complete
5. Wait 30-60 seconds for the note to generate

Important: Let patients know the visit is being recorded for documentation purposes.`,
        tip: 'You don\'t need to speak in "medical dictation" style. Natural conversation works best.'
      },
      {
        title: 'Review and Edit the Note',
        content: `After recording, Scribe generates a draft note:

1. Review the generated note for accuracy
2. Click on any section to edit directly
3. Use the Regenerate button if a section needs rewriting
4. Add any information Scribe may have missed
5. Remove any irrelevant content

The note will be formatted according to your specialty and note type preferences.`,
        tip: 'Always review AI-generated notes before finalizing. Scribe is highly accurate but not perfect.'
      },
      {
        title: 'Copy to Your EMR',
        content: `Once you're satisfied with the note:

1. Click the Copy button to copy the entire note
2. Open your EMR and navigate to the patient's chart
3. Paste the note into the appropriate section
4. Save the note in your EMR

Alternative: Use the "Copy Section" buttons to copy individual sections (Chief Complaint, HPI, Assessment, Plan, etc.) if your EMR has separate fields.`,
        tip: 'Some EMRs support "smart phrases" - you could create one that pastes from clipboard for even faster workflow.'
      }
    ],
    tips: [
      'Doximity Scribe does NOT store any audio recordings - they are processed in real-time and immediately discarded',
      'All Doximity users are automatically covered by a Business Associate Agreement (BAA)',
      'Scribe works best in quiet environments with clear speech',
      'You can use Scribe for telehealth visits by recording your computer audio',
      'If a note seems off, try re-recording with clearer speech rather than extensive manual editing'
    ]
  },

  'freed-ai': {
    toolId: 'freed-ai',
    overview: 'Freed is an AI medical scribe that automatically generates clinical documentation from your patient conversations. It adapts to your personal writing style and works with any EMR.',
    timeEstimate: '10-15 minutes',
    prerequisites: [
      'Email address for account creation',
      'Computer or smartphone with microphone',
      'Credit card for paid plans (free trial available)'
    ],
    steps: [
      {
        title: 'Create Your Freed Account',
        content: `1. Go to getfreed.ai and click "Start Free Trial"
2. Enter your email address and create a password
3. Verify your email by clicking the link sent to your inbox
4. Complete the onboarding questionnaire:
   - Your medical specialty
   - Your typical note format (SOAP, H&P, etc.)
   - Your EMR system

Freed offers a free trial so you can test it before committing.`,
        tip: 'Use your work email if your practice will be paying for the subscription.'
      },
      {
        title: 'Install Freed on Your Devices',
        content: `Freed works on multiple platforms:

Desktop (Recommended for telehealth)
1. Go to app.getfreed.ai in Chrome, Safari, or Edge
2. Bookmark it for quick access
3. Allow microphone permissions when prompted

Mobile App
1. Download "Freed - AI Medical Scribe" from App Store or Google Play
2. Log in with your account credentials
3. Grant microphone and notification permissions

Chrome Extension (Optional)
1. Install the Freed Chrome extension
2. This allows one-click recording from any browser tab`,
        tip: 'The web app works on any device - no installation required. Mobile app is better for in-person visits.'
      },
      {
        title: 'Configure Your Note Templates',
        content: `Freed learns your style, but you can customize templates:

1. Go to Settings > Note Templates
2. Choose your default template or create a custom one
3. Set which sections to include:
   - Chief Complaint
   - History of Present Illness
   - Review of Systems
   - Physical Exam
   - Assessment & Plan
   - Patient Instructions
4. Adjust the verbosity level (concise, moderate, detailed)
5. Add any custom sections specific to your practice`,
        tip: 'Freed learns from your edits over time. The more you use it and correct it, the better it gets.'
      },
      {
        title: 'Record Your First Patient Encounter',
        content: `When you're ready to document:

1. Open Freed and click the Start Visit button
2. Enter the patient's name (or initials for privacy)
3. Select the visit type if prompted
4. Click Record to begin capturing the conversation
5. Conduct your visit normally - speak naturally
6. Click End Visit when finished

Freed captures both sides of the conversation and identifies speaker roles automatically.`,
        tip: 'Freed works great for telehealth - it can capture audio from your video call software.'
      },
      {
        title: 'Review and Finalize Your Note',
        content: `After the visit ends, Freed generates your note within 1-2 minutes:

1. Review the generated note in the Freed interface
2. Click on any section to edit text directly
3. Use Regenerate Section if something needs rewriting
4. Check the ICD-10 suggestions and add relevant codes
5. Review any flagged items that may need attention
6. Click Finalize when the note is ready`,
        tip: 'Freed highlights low-confidence sections in yellow. Pay extra attention to these.'
      },
      {
        title: 'Export to Your EMR',
        content: `Get your note into your EMR:

Copy/Paste Method
1. Click Copy Note to copy the entire note
2. Paste into your EMR's documentation section

Direct Integration (if available)
Some EMRs have direct Freed integrations:
1. Go to Settings > Integrations
2. Connect your EMR if listed
3. Notes can then be sent directly to patient charts

Smart Phrase Method
If your EMR supports smart phrases/dot phrases, you can set up a workflow to paste Freed notes automatically.`,
        tip: 'Even without direct integration, copy/paste takes just seconds and works with any EMR.'
      }
    ],
    tips: [
      'Freed does NOT store patient recordings - audio is processed and immediately deleted',
      'The AI improves over time by learning your editing patterns (not from audio)',
      'Works in any language - useful for interpreters or multilingual patients',
      'You can pause and resume recording if needed during a visit',
      'Use the "Add Context" feature to include relevant info before the visit starts'
    ]
  },

  'intakeq': {
    toolId: 'intakeq',
    overview: 'IntakeQ is a HIPAA-compliant digital intake solution that lets you create custom patient forms, collect e-signatures, and integrate with your practice management system.',
    timeEstimate: '30-45 minutes for basic setup',
    prerequisites: [
      'Email address for account creation',
      'List of information you want to collect from patients',
      'Your practice logo (optional, for branding)',
      'Credit card for subscription (14-day free trial available)'
    ],
    steps: [
      {
        title: 'Create Your IntakeQ Account',
        content: `1. Go to intakeq.com and click "Start Free Trial"
2. Enter your practice name and email address
3. Create a secure password
4. Choose your practice type:
   - Medical Practice
   - Mental Health
   - Dental
   - Wellness/Alternative
5. Select your timezone
6. Verify your email address

Your account is automatically HIPAA-compliant with BAA coverage.`,
        tip: 'IntakeQ offers a 14-day free trial with full features - no credit card required to start.'
      },
      {
        title: 'Set Up Your Practice Profile',
        content: `Configure your practice information:

1. Go to Settings > Practice Info
2. Add your practice details:
   - Practice name and address
   - Phone number and email
   - Website URL
3. Upload your logo for branded forms
4. Set your business hours
5. Configure your appointment types if using scheduling

This information will appear on your intake forms and emails.`,
        tip: 'Adding your logo makes forms look professional and helps patients trust they\'re filling out the right form.'
      },
      {
        title: 'Create Your First Intake Form',
        content: `Build a custom intake form:

1. Go to Forms > Create New Form
2. Choose a starting point:
   - Template: Start with a pre-built template for your specialty
   - Blank: Build from scratch
3. Use the drag-and-drop builder to add fields:
   - Text fields (name, address, etc.)
   - Date pickers (DOB, appointment dates)
   - Checkboxes and radio buttons (yes/no questions)
   - Signature fields (consent forms)
   - File uploads (insurance cards, IDs)
4. Add conditional logic to show/hide fields based on answers
5. Click Save when finished`,
        tip: 'Start with a template and customize it - much faster than building from scratch.'
      },
      {
        title: 'Configure Form Settings',
        content: `Set up how your form behaves:

1. Click Settings on your form
2. Configure:
   - Form title and description
   - Completion message (what patients see after submitting)
   - Email notifications (get notified when forms are submitted)
   - Expiration (how long the form link stays valid)
3. Set up e-signature requirements for consent forms
4. Enable save and continue if the form is long
5. Add password protection if needed for sensitive forms`,
        tip: 'Enable "Save and Continue" for longer forms - patients can finish later without losing progress.'
      },
      {
        title: 'Test Your Form',
        content: `Before sending to patients, test thoroughly:

1. Click Preview to see the patient view
2. Fill out the form yourself as a test
3. Submit the test and check:
   - Did you receive the notification email?
   - Does the data appear correctly in IntakeQ?
   - Are conditional fields working properly?
4. Test on mobile (most patients use phones)
5. Make any needed adjustments`,
        tip: 'Ask a colleague to test too - fresh eyes catch issues you might miss.'
      },
      {
        title: 'Send Forms to Patients',
        content: `Get forms in front of patients:

Option A: Email Individual Patients
1. Go to Clients > Send Intake
2. Enter the patient's email address
3. Select which form(s) to send
4. Customize the email message
5. Click Send

Option B: Share a Public Link
1. Go to your form and click Share
2. Copy the public link
3. Add it to your website, emails, or text messages

Option C: Embed on Your Website
1. Get the embed code from Share > Embed
2. Add it to your website's new patient page`,
        tip: 'Send forms 24-48 hours before appointments - gives patients time to complete thoughtfully.'
      },
      {
        title: 'Review Submitted Forms',
        content: `When patients submit forms:

1. You'll receive an email notification
2. Go to Clients to see submissions
3. Click on a client to view their completed forms
4. Review the information and flag anything that needs follow-up
5. Print or Export to PDF if needed
6. Forms are automatically saved and searchable

You can also set up staff notifications so your team sees new submissions.`,
        tip: 'Use IntakeQ\'s search to quickly find patient forms - much faster than paper filing.'
      }
    ],
    tips: [
      'IntakeQ is HIPAA-compliant out of the box - they sign a BAA with every account',
      'Forms work on any device - phone, tablet, or computer',
      'Use templates for common form types (demographics, medical history, consent)',
      'Set up automated reminders for incomplete forms',
      'IntakeQ integrates with many EMRs and practice management systems',
      'You can require patients to complete forms before booking appointments'
    ]
  }
};

export function getGuideByToolId(toolId: string): Guide | undefined {
  return guides[toolId];
}

export function hasGuide(toolId: string): boolean {
  return toolId in guides;
}
