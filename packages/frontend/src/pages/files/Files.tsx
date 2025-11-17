import { useState } from 'react';

interface FileItem {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  isPHI: boolean;
  redactionStatus: 'pending' | 'in-progress' | 'completed' | 'skipped';
  vectorized: boolean;
  chunks: number;
}

export default function Files() {
  const [isDragging, setIsDragging] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRedactionModal, setShowRedactionModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isPHI, setIsPHI] = useState(true);

  // Mock data
  const files: FileItem[] = [
    {
      id: '1',
      name: 'patient_history_template.pdf',
      size: '2.4 MB',
      uploadedAt: '2 hours ago',
      isPHI: true,
      redactionStatus: 'completed',
      vectorized: true,
      chunks: 45,
    },
    {
      id: '2',
      name: 'surgical_notes_guidelines.docx',
      size: '1.8 MB',
      uploadedAt: '1 day ago',
      isPHI: false,
      redactionStatus: 'skipped',
      vectorized: true,
      chunks: 32,
    },
    {
      id: '3',
      name: 'prior_auth_template.xlsx',
      size: '856 KB',
      uploadedAt: '3 days ago',
      isPHI: true,
      redactionStatus: 'completed',
      vectorized: true,
      chunks: 18,
    },
    {
      id: '4',
      name: 'patient_discharge_instructions.pdf',
      size: '1.2 MB',
      uploadedAt: '1 week ago',
      isPHI: true,
      redactionStatus: 'in-progress',
      vectorized: false,
      chunks: 0,
    },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setShowUploadModal(true);
  };

  const handleFileSelect = () => {
    setShowUploadModal(true);
  };

  const handleReviewRedaction = (file: FileItem) => {
    setSelectedFile(file);
    setShowRedactionModal(true);
  };

  const handleApproveRedaction = () => {
    alert('Redaction approved. Vectorization started. Original file will be deleted after vectorization.');
    setShowRedactionModal(false);
  };

  const getRedactionStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'skipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">File Management</h1>
        <p className="text-gray-600 mt-1">Upload and manage documents for your AI workflows</p>
      </div>

      {/* HIPAA Warning Banner */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 mb-1">PHI Handling Protocol</h3>
            <p className="text-sm text-yellow-800">
              All files containing PHI will undergo automatic de-identification. You must review and approve the redaction before vectorization. Original PHI-containing files are permanently deleted after vectorization to maintain HIPAA compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
      >
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Drop files here or click to upload
        </h3>
        <p className="text-gray-600 mb-6">
          Supported formats: PDF, Word, Excel, JPG, PNG, HL7/FHIR messages
        </p>
        <button
          onClick={handleFileSelect}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Select Files
        </button>
      </div>

      {/* File List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Uploaded Files</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{files.length} files</span>
              <span>•</span>
              <span>{files.filter((f) => f.vectorized).length} vectorized</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">
                        {file.name.endsWith('.pdf')
                          ? '📄'
                          : file.name.endsWith('.docx')
                          ? '📝'
                          : file.name.endsWith('.xlsx')
                          ? '📊'
                          : '📁'}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{file.name}</h3>
                        <p className="text-sm text-gray-600">
                          {file.size} • Uploaded {file.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-11">
                      {file.isPHI && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          Contains PHI
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRedactionStatusColor(
                          file.redactionStatus
                        )}`}
                      >
                        Redaction: {file.redactionStatus}
                      </span>
                      {file.vectorized ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          ✓ Vectorized ({file.chunks} chunks)
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          Pending vectorization
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {file.redactionStatus === 'in-progress' && (
                      <button
                        onClick={() => handleReviewRedaction(file)}
                        className="px-3 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700"
                      >
                        Review Redaction
                      </button>
                    )}
                    <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                      View
                    </button>
                    <button className="px-3 py-2 border border-red-300 rounded-lg text-sm text-red-600 hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Upload File</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* File Selection (simulated) */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="font-medium text-gray-900">example_document.pdf</p>
                  <p className="text-sm text-gray-600">2.4 MB</p>
                </div>

                {/* PHI Flag */}
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
                  <h3 className="font-semibold text-red-900 mb-4">
                    ⚠️ Does this file contain PHI (Protected Health Information)?
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-start p-4 border-2 border-red-300 rounded-lg cursor-pointer hover:bg-red-100">
                      <input
                        type="radio"
                        name="phi"
                        checked={isPHI}
                        onChange={() => setIsPHI(true)}
                        className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">Yes, contains PHI</p>
                        <p className="text-sm text-gray-600 mt-1">
                          File will undergo automatic de-identification. You'll review the redacted
                          version before approval. Original will be deleted after vectorization.
                        </p>
                      </div>
                    </label>
                    <label className="flex items-start p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                      <input
                        type="radio"
                        name="phi"
                        checked={!isPHI}
                        onChange={() => setIsPHI(false)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">No PHI</p>
                        <p className="text-sm text-gray-600 mt-1">
                          You accept full responsibility for ensuring no PHI is present.
                          Misclassification may result in HIPAA violations.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Chunking Settings */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Vectorization Settings</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center justify-between">
                      <span>Chunk Size:</span>
                      <span className="font-medium">512 tokens (Platform default)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Overlap:</span>
                      <span className="font-medium">50 tokens</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Estimated Credits:</span>
                      <span className="font-medium">~15 credits</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      alert(
                        isPHI
                          ? 'File uploaded. Starting de-identification process...'
                          : 'File uploaded. Starting vectorization...'
                      );
                      setShowUploadModal(false);
                    }}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    Upload & Process
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Redaction Review Modal */}
      {showRedactionModal && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Review De-identification</h2>
                <button
                  onClick={() => setShowRedactionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">{selectedFile.name}</p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Before/After Comparison */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">📄</span>
                      Original (Sample)
                    </h3>
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 h-64 overflow-auto">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {`Patient Name: John Smith
DOB: 01/15/1975
MRN: 123456789
SSN: 555-12-3456

Chief Complaint: Patient presents with knee pain following a fall on 03/15/2024.

History: 48-year-old male with history of hypertension...`}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">✅</span>
                      De-identified
                    </h3>
                    <div className="bg-green-50 border border-green-300 rounded-lg p-4 h-64 overflow-auto">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {`Patient Name: [REDACTED-NAME-001]
DOB: [REDACTED-DATE-001]
MRN: [REDACTED-ID-001]
SSN: [REDACTED-SSN-001]

Chief Complaint: Patient presents with knee pain following a fall on [REDACTED-DATE-002].

History: [REDACTED-AGE-001]-year-old male with history of hypertension...`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Redaction Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Redaction Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-800">Names:</span>
                      <span className="ml-2 font-medium">3 instances redacted</span>
                    </div>
                    <div>
                      <span className="text-blue-800">Dates:</span>
                      <span className="ml-2 font-medium">5 instances redacted</span>
                    </div>
                    <div>
                      <span className="text-blue-800">IDs (MRN, SSN):</span>
                      <span className="ml-2 font-medium">4 instances redacted</span>
                    </div>
                    <div>
                      <span className="text-blue-800">Addresses:</span>
                      <span className="ml-2 font-medium">2 instances redacted</span>
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Please carefully review the de-identified version. Once approved, the original file will be permanently deleted and only the de-identified vectors will be retained.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowRedactionModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => alert('Regenerating with different settings...')}
                    className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700"
                  >
                    Re-run Redaction
                  </button>
                  <button
                    onClick={handleApproveRedaction}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                  >
                    Approve & Vectorize
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
