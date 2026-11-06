import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, ShieldCheck, Clock, XCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { verificationAPI } from '../../services/api';
import VerificationBadge from '../../components/VerificationBadge';

type Step = 1 | 2 | 3;

interface UploadedFile {
  file: File;
  preview: string;
}

export default function VerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, fetchBookings } = useApp();
  
  const redirectTo = searchParams.get('redirect') || '';
  const redirectListingId = searchParams.get('listingId') || '';

  const [step, setStep] = useState<Step>(1);
  const [status, setStatus] = useState<'unverified' | 'pending' | 'verified' | 'rejected' | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [reviewedAt, setReviewedAt] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [idFront, setIdFront] = useState<UploadedFile | null>(null);
  const [idBack, setIdBack] = useState<UploadedFile | null>(null);
  const [selfie, setSelfie] = useState<UploadedFile | null>(null);
  const [confirmAuthenticity, setConfirmAuthenticity] = useState(false);

  const fetchVerificationStatus = useCallback(async () => {
    try {
      const data = await verificationAPI.getStatus();
      setStatus(data.id_verification_status);
      setSubmittedAt(data.id_verification_submitted_at);
      setReviewedAt(data.id_verification_reviewed_at);
      setNotes(data.id_verification_notes);
    } catch (err: any) {
      console.error('Failed to fetch verification status:', err);
    }
  }, []);

  useEffect(() => {
    fetchVerificationStatus();
  }, [fetchVerificationStatus]);

  const handleFileUpload = (file: File, setter: (f: UploadedFile | null) => void) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, HEIC)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    const preview = URL.createObjectURL(file);
    setter({ file, preview });
    setError(null);
  };

  const removeFile = (setter: (f: UploadedFile | null) => void, current: UploadedFile | null) => {
    if (current?.preview) URL.revokeObjectURL(current.preview);
    setter(null);
  };

  const handleSubmit = async () => {
    if (!idFront || !idBack || !selfie) {
      setError('All three documents are required');
      return;
    }
    if (!confirmAuthenticity) {
      setError('Please confirm the documents are genuine');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await verificationAPI.submit({ id_front: idFront.file, id_back: idBack.file, selfie: selfie.file });
      setSuccess(true);
      setStatus('pending');
      setSubmittedAt(new Date().toISOString());
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to submit verification');
    } finally {
      setLoading(false);
    }
  };

  const handleResubmit = () => {
    setSuccess(false);
    setStatus('unverified');
    setSubmittedAt(null);
    setReviewedAt(null);
    setNotes(null);
    setIdFront(null);
    setIdBack(null);
    setSelfie(null);
    setConfirmAuthenticity(false);
    setStep(2);
  };

  const goBack = () => {
    if (redirectTo === 'checkout' && redirectListingId) {
      navigate(`/checkout`, { replace: true });
    } else if (redirectTo === 'create-listing') {
      navigate('/create-listing', { replace: true });
    } else {
      navigate(-1);
    }
  };

  // If already verified and not forced to show page
  if (status === 'verified' && !redirectTo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
            <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Identity Verification</h1>
          </div>
        </header>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl p-8 card-shadow text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity Verified ✓</h2>
            <p className="text-gray-500 mb-4">Your identity has been verified. You can now book any listing.</p>
            <VerificationBadge status="verified" size="lg" />
          </div>
        </div>
      </div>
    );
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-8">
      {[1, 2, 3].map(s => (
        <React.Fragment key={s}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${s < step ? 'bg-blue-600 text-white' : s === step ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
            {s}
          </div>
          {s < 3 && <div className={`w-16 h-1 rounded ${s < step ? 'bg-blue-600' : 'bg-gray-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
      <p className="text-gray-500">Please review your information (from your profile)</p>
      
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-500">Full Name</span>
          <span className="font-medium text-gray-900">{user?.full_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Email</span>
          <span className="font-medium text-gray-900">{user?.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Phone</span>
          <span className="font-medium text-gray-900">{user?.phone}</span>
        </div>
      </div>
      
      <button onClick={() => setStep(2)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
        Continue
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Upload Documents</h2>
      <p className="text-gray-500">All three documents are required for verification</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-4">
        <DocumentUpload
          label="SA ID Document - Front"
          description="Clear photo of the front of your South African ID card"
          icon={<Upload className="w-6 h-6" />}
          file={idFront}
          onUpload={f => handleFileUpload(f, setIdFront)}
          onRemove={() => removeFile(setIdFront, idFront)}
        />
        <DocumentUpload
          label="SA ID Document - Back"
          description="Clear photo of the back of your South African ID card"
          icon={<Upload className="w-6 h-6" />}
          file={idBack}
          onUpload={f => handleFileUpload(f, setIdBack)}
          onRemove={() => removeFile(setIdBack, idBack)}
        />
        <DocumentUpload
          label="Selfie with ID"
          description="Hold your ID next to your face for facial recognition matching"
          icon={<Upload className="w-6 h-6" />}
          file={selfie}
          onUpload={f => handleFileUpload(f, setSelfie)}
          onRemove={() => removeFile(setSelfie, selfie)}
        />
      </div>

      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Security Notice</p>
          <p>Your documents are encrypted and stored securely on Cloudinary. They will only be accessed by our verification team for identity confirmation and will be deleted after verification is complete.</p>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
          Back
        </button>
        <button onClick={() => setStep(3)} disabled={!idFront || !idBack || !selfie} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
          Review & Submit
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => {
    if (success) {
      return (
        <div className="space-y-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Submitted for Review!</h2>
          <p className="text-gray-500 mb-6">Your documents have been submitted. Review typically takes <strong>24 hours</strong>.</p>
          
          <VerificationBadge status="pending" size="lg" variant="banner" />
          
          <div className="bg-gray-50 rounded-xl p-4 text-left">
            <p className="text-sm text-gray-600 mb-2"><strong>What happens next:</strong></p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Our team will review your documents</li>
              <li>Facial recognition match will be performed</li>
              <li>You'll receive an email notification with the result</li>
              <li>If approved, you'll get the "Verified" badge</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button onClick={goBack} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
              {redirectTo === 'checkout' ? 'Return to Checkout' : redirectTo === 'create-listing' ? 'Return to Create Listing' : 'Go to Dashboard'}
            </button>
          </div>
        </div>
      );
    }

    if (status === 'pending') {
      return (
        <div className="space-y-4 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-10 h-10 text-yellow-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Under Review</h2>
          <p className="text-gray-500 mb-4">Your submission is being reviewed. This typically takes <strong>24 hours</strong>.</p>
          
          <VerificationBadge status="pending" size="lg" variant="banner" />
          
          {submittedAt && (
            <p className="text-sm text-gray-500">Submitted: {new Date(submittedAt).toLocaleDateString()}</p>
          )}

          <button onClick={goBack} className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
            Check Back Later
          </button>
        </div>
      );
    }

    if (status === 'verified') {
      return (
        <div className="space-y-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Identity Verified! ✓</h2>
          <p className="text-gray-500 mb-4">Congratulations! Your identity has been verified.</p>
          
          <VerificationBadge status="verified" size="lg" variant="banner" />
          
          {reviewedAt && (
            <p className="text-sm text-gray-500">Verified: {new Date(reviewedAt).toLocaleDateString()}</p>
          )}

          <div className="flex gap-3">
            <button onClick={goBack} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
              {redirectTo === 'checkout' ? 'Continue to Checkout' : redirectTo === 'create-listing' ? 'Continue to Create Listing' : 'Go to Dashboard'}
            </button>
          </div>
        </div>
      );
    }

    if (status === 'rejected') {
      return (
        <div className="space-y-4 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verification Rejected</h2>
          <p className="text-gray-500 mb-4">Unfortunately, your verification could not be approved.</p>
          
          <VerificationBadge status="rejected" size="lg" variant="banner" />
          
          {notes && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left">
              <p className="text-sm text-red-700 font-medium mb-2">Reason:</p>
              <p className="text-sm text-red-600">{notes}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={handleResubmit} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
              Resubmit Documents
            </button>
            <button onClick={goBack} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
              Go Back
            </button>
          </div>
        </div>
      );
    }

    // Default: show review screen
    return (
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-gray-900">Review & Submit</h2>
        <p className="text-gray-500">Please review your documents before submitting</p>

        <div className="grid grid-cols-3 gap-3">
          <DocumentPreview label="ID Front" file={idFront} />
          <DocumentPreview label="ID Back" file={idBack} />
          <DocumentPreview label="Selfie" file={selfie} />
        </div>

        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-800">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmAuthenticity}
                onChange={e => setConfirmAuthenticity(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span>I confirm these are genuine documents and the selfie matches my ID photo. I understand that submitting false documents is a criminal offense.</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
            Back
          </button>
          <button onClick={handleSubmit} disabled={loading || !confirmAuthenticity} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</span>
            ) : (
              'Submit for Review'
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Identity Verification</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {status && status !== 'unverified' && !success && (
          <VerificationBadge status={status} size="lg" variant="banner" className="mb-6" />
        )}

        <div className="bg-white rounded-2xl p-6 card-shadow">
          {step <= 3 && renderStepIndicator()}
          
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
}

interface DocumentUploadProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  file: UploadedFile | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

function DocumentUpload({ label, description, icon, file, onUpload, onRemove }: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  if (file) {
    return (
      <div className="relative bg-gray-50 rounded-xl p-4 border-2 border-green-200">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 flex-shrink-0 overflow-hidden">
            <img src={file.preview} alt={label} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900">{label}</p>
            <p className="text-sm text-green-600">✓ Uploaded successfully</p>
            <p className="text-xs text-gray-400">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button onClick={onRemove} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative rounded-xl p-6 border-2 border-dashed transition ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
          {icon}
        </div>
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        <p className="text-sm text-gray-500 mb-3">{description}</p>
        <p className="text-xs text-gray-400">Click to upload or drag & drop (max 10MB)</p>
      </div>
    </div>
  );
}

interface DocumentPreviewProps {
  label: string;
  file: UploadedFile | null;
}

function DocumentPreview({ label, file }: DocumentPreviewProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-center">
      <p className="text-xs text-gray-500 mb-2">{label}</p>
      {file ? (
        <img src={file.preview} alt={label} className="w-full h-24 object-cover rounded-lg mx-auto" />
      ) : (
        <div className="w-full h-24 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
          Not uploaded
        </div>
      )}
    </div>
  );
}
