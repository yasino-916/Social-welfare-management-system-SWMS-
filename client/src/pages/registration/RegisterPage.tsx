import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api/client';
import { applicationApi } from '@/services/api/applicationApi';
import { householdApi } from '@/services/api/householdApi';
import { personApi } from '@/services/api/personApi';
import FormField from '@/components/forms/FormField';
import SelectField from '@/components/forms/SelectField';
import toast from 'react-hot-toast';

type Step = 'household' | 'members' | 'documents' | 'submit' | 'done';

export default function RegisterPage() {
  const [step, setStep] = useState<Step>('household');
  const [householdId, setHouseholdId] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [documents, setDocuments] = useState<File[]>([]);
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [householdSummary, setHouseholdSummary] = useState<any>(null);
  const [membersSummary, setMembersSummary] = useState<any[]>([]);

  // Step indicators
  const steps: Step[] = ['household', 'members', 'documents', 'submit', 'done'];
  const stepIndex = steps.indexOf(step);

  if (step === 'done') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-gray-900">Registration Submitted!</h2>
        <p className="mt-2 text-gray-600">Your application reference number is:</p>
        <p className="mt-2 text-lg font-mono font-bold text-primary-700 bg-primary-50 rounded px-4 py-2 inline-block">
          {referenceNumber}
        </p>
        <p className="mt-3 text-sm text-gray-500">
          Save this number to track your application status.
        </p>
        <a href="/application/status" className="btn-primary mt-4 inline-flex">
          Check Application Status
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Register New Applicant</h1>
      <p className="text-sm text-gray-500 mb-6">
        No account is required. Complete all steps to submit your household registration.
      </p>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {['Household', 'Members', 'Documents', 'Submit'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-300
              ${i < stepIndex ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-emerald-500/30' : i === stepIndex ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/30 ring-4 ring-blue-500/20' : 'bg-white text-slate-400 border border-slate-200'}`}>
              {i < stepIndex ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              ) : (
                i + 1
              )}
            </div>
            <span className={`text-sm hidden sm:block font-medium transition-colors duration-300 ${i === stepIndex ? 'text-blue-700' : i < stepIndex ? 'text-slate-700' : 'text-slate-400'}`}>
              {label}
            </span>
            {i < 3 && <div className={`flex-1 h-1 rounded-full w-6 sm:w-10 transition-colors duration-300 ${i < stepIndex ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step content */}
      {step === 'household' && (
        <HouseholdStep
          onNext={(id: string, summary: any) => { setHouseholdId(id); setHouseholdSummary(summary); setStep('members'); }}
        />
      )}
      {step === 'members' && (
        <MembersStep householdId={householdId} onNext={(members) => { setMembersSummary(members); setStep('documents'); }} onBack={() => setStep('household')} />
      )}
      {step === 'documents' && (
        <DocumentsStep
          documents={documents}
          setDocuments={setDocuments}
          idFront={idFront}
          setIdFront={setIdFront}
          idBack={idBack}
          setIdBack={setIdBack}
          onNext={() => setStep('submit')}
          onBack={() => setStep('members')}
        />
      )}
      {step === 'submit' && (
        <SubmitStep
          householdId={householdId}
          documents={documents}
          idFront={idFront}
          idBack={idBack}
          householdSummary={householdSummary}
          membersSummary={membersSummary}
          onSuccess={(ref) => { setReferenceNumber(ref); setStep('done'); }}
          onBack={() => setStep('documents')}
        />
      )}
    </div>
  );
}

function HouseholdStep({ onNext }: { onNext: (id: string, summary: any) => void }) {
  const [kebeleId, setKebeleId] = useState('');
  const [village, setVillage] = useState('');
  const [size, setSize] = useState('');
  const [reason, setReason] = useState('');
  const [other, setOther] = useState('');

  const { data: kebeles } = useQuery({
    queryKey: ['publicKebeles'],
    queryFn: async () => {
      const { data } = await apiClient.get('/public/kebeles');
      return data.data;
    }
  });

  const { data: reasonsList } = useQuery({
    queryKey: ['publicReasons'],
    queryFn: async () => {
      const { data } = await apiClient.get('/public/registration-reasons');
      return data.data;
    }
  });

  // Find if selected reason requires description (or is "other")
  const selectedReasonObj = reasonsList?.find((r: any) => r.id === reason);
  const requiresOther = selectedReasonObj?.code === 'other' || selectedReasonObj?.requires_description;

  const mutation = useMutation({
    mutationFn: () =>
      householdApi.publicCreate({
        kebele_id: kebeleId,
        village,
        household_size: Number(size),
        registration_reason_id: reason,
        other_reason_description: requiresOther ? other : undefined,
      } as Parameters<typeof householdApi.publicCreate>[0]),
    onSuccess: (data) => {
      onNext(data.id, {
        kebele: kebeles?.find((k: any) => k.id === kebeleId)?.name,
        village,
        size,
        reason: requiresOther ? other : reasonsList?.find((r: any) => r.id === reason)?.label_en
      });
    },
    onError: () => toast.error('Failed to save household info'),
  });

  return (
    <div className="card space-y-5">
      <FormField label="Kebele" htmlFor="kebeleId" required>
        <SelectField
          id="kebeleId"
          placeholder="Select your Kebele..."
          options={kebeles?.map((k: any) => ({ value: k.id, label: k.name })) || []}
          value={kebeleId}
          onChange={(e) => setKebeleId(e.target.value)}
        />
      </FormField>
      <FormField label="Village / Area" htmlFor="village">
        <input id="village" type="text" className="input" value={village} onChange={(e) => setVillage(e.target.value)} />
      </FormField>
      <FormField label="Household Size" htmlFor="size" required>
        <input id="size" type="number" min={1} className="input" value={size} onChange={(e) => setSize(e.target.value)} />
      </FormField>
      <FormField label="Registration Reason" htmlFor="reason" required>
        <SelectField
          id="reason"
          placeholder="Select reason..."
          options={reasonsList?.map((r: any) => ({ value: r.id, label: r.label_en })) || []}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </FormField>
      {requiresOther && (
        <FormField label="Describe the reason" htmlFor="other" required>
          <input id="other" type="text" className="input" value={other} onChange={(e) => setOther(e.target.value)} />
        </FormField>
      )}
      <button className="btn-primary w-full" onClick={() => mutation.mutate()} disabled={mutation.isPending || !size || !reason || !kebeleId}>
        {mutation.isPending ? 'Saving...' : 'Save & Continue'}
      </button>
    </div>
  );
}

function MembersStep({ householdId, onNext, onBack }: { householdId: string; onNext: (members: any[]) => void; onBack: () => void }) {
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [relationship, setRelationship] = useState('');
  const [members, setMembers] = useState<any[]>([]);

  const addMutation = useMutation({
    mutationFn: () =>
      personApi.publicCreate({ full_name: fullName, gender: gender as Parameters<typeof personApi.publicCreate>[0]['gender'], date_of_birth: dob }).then((person) =>
        householdApi.publicAddMember(householdId, { person_id: person.id, relationship_to_head: relationship, is_head: members.length === 0 })
      ),
    onSuccess: () => {
      setMembers((prev) => [...prev, { name: fullName, rel: relationship, dob }]);
      setFullName(''); setGender(''); setDob(''); setRelationship('');
      toast.success('Member added');
    },
    onError: () => toast.error('Failed to add member'),
  });

  return (
    <div className="card space-y-5">
      <p className="text-sm text-gray-500">Add all household members. The first member will be set as the household head.</p>
      {members.length > 0 && (
        <ul className="text-sm space-y-1">
          {members.map((m, i) => <li key={i} className="text-gray-700">✓ {m.name} ({m.rel}) {i === 0 ? '- Head' : ''}</li>)}
        </ul>
      )}
      <FormField label="Full Name" htmlFor="fullName" required>
        <input id="fullName" type="text" className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </FormField>
      <FormField label="Gender" htmlFor="gender" required>
        <SelectField id="gender" placeholder="Select..." options={[{ value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }, { value: 'OTHER', label: 'Other' }]} value={gender} onChange={(e) => setGender(e.target.value)} />
      </FormField>
      <FormField label="Date of Birth" htmlFor="dob">
        <input id="dob" type="date" className="input" value={dob} onChange={(e) => setDob(e.target.value)} />
      </FormField>
      <FormField label="Relationship to Head" htmlFor="relationship" required>
        <input id="relationship" type="text" className="input" placeholder="e.g. Head, Spouse, Child" value={relationship} onChange={(e) => setRelationship(e.target.value)} />
      </FormField>
      <button className="btn-secondary w-full" onClick={() => addMutation.mutate()} disabled={addMutation.isPending || !fullName || !gender || !relationship}>
        {addMutation.isPending ? 'Adding...' : '+ Add Member'}
      </button>
      <div className="flex justify-between pt-2">
        <button className="btn-secondary" onClick={onBack}>Back</button>
        <button className="btn-primary" onClick={() => onNext(members)} disabled={members.length === 0}>Continue</button>
      </div>
    </div>
  );
}

function DocumentsStep({ documents, setDocuments, idFront, setIdFront, idBack, setIdBack, onNext, onBack }: { documents: File[]; setDocuments: React.Dispatch<React.SetStateAction<File[]>>; idFront: File | null; setIdFront: React.Dispatch<React.SetStateAction<File | null>>; idBack: File | null; setIdBack: React.Dispatch<React.SetStateAction<File | null>>; onNext: () => void; onBack: () => void }) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocuments(Array.from(e.target.files));
    }
  };

  return (
    <div className="card space-y-6">
      <div className="text-center">
        <p className="text-sm text-slate-500 mb-4">Please upload both sides of the Household Head's National ID, plus any other supporting documents.</p>
      </div>

      {/* National ID Front */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">National ID (Front Side) *</label>
        {idFront ? (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
            <span className="text-sm font-medium text-blue-700 truncate">{idFront.name}</span>
            <button onClick={() => setIdFront(null)} className="text-blue-500 hover:text-blue-700 font-bold px-2">&times;</button>
          </div>
        ) : (
          <input type="file" accept="image/*,.pdf" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => { if (e.target.files?.[0]) setIdFront(e.target.files[0]) }} />
        )}
      </div>

      {/* National ID Back */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">National ID (Back Side) *</label>
        {idBack ? (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
            <span className="text-sm font-medium text-blue-700 truncate">{idBack.name}</span>
            <button onClick={() => setIdBack(null)} className="text-blue-500 hover:text-blue-700 font-bold px-2">&times;</button>
          </div>
        ) : (
          <input type="file" accept="image/*,.pdf" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => { if (e.target.files?.[0]) setIdBack(e.target.files[0]) }} />
        )}
      </div>

      {/* Other Documents */}
      <div className="pt-4 border-t border-slate-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">Other Supporting Documents (Optional)</label>
        <input type="file" multiple className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" onChange={handleFileChange} />
        
        {documents.length > 0 && (
          <ul className="mt-4 space-y-2">
            {documents.map((doc, i) => (
              <li key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-sm font-medium text-slate-700 truncate">{doc.name}</span>
                <button onClick={() => setDocuments(docs => docs.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 font-bold px-2">&times;</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-between pt-4 border-t border-slate-100">
        <button className="btn-secondary" onClick={onBack}>Back</button>
        <button className="btn-primary" onClick={onNext} disabled={!idFront || !idBack}>Continue</button>
      </div>
    </div>
  );
}

function SubmitStep({ householdId, documents, idFront, idBack, householdSummary, membersSummary, onSuccess, onBack }: { householdId: string; documents: File[]; idFront: File | null; idBack: File | null; householdSummary: any; membersSummary: any[]; onSuccess: (ref: string) => void; onBack: () => void }) {
  const mutation = useMutation({
    mutationFn: async () => {
      const appData = await applicationApi.publicSubmit({ household_id: householdId });
      const { documentApi } = await import('@/services/api/documentApi');

      const allDocs = [...documents];
      if (idFront) allDocs.push(idFront);
      if (idBack) allDocs.push(idBack);

      for (const file of allDocs) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('application_id', appData.id);
        
        let docType = 'GENERAL_SUPPORTING';
        if (file === idFront) docType = 'NATIONAL_ID_FRONT';
        if (file === idBack) docType = 'NATIONAL_ID_BACK';
        formData.append('document_type', docType); 
        await documentApi.publicUpload(formData);
      }
      
      return appData;
    },
    onSuccess: (data) => onSuccess(data.reference_number),
    onError: () => toast.error('Submission failed. Please try again.'),
  });

  return (
    <div className="card space-y-6">
      <div className="text-center mb-6">
        <p className="text-lg font-bold text-gray-900">Review Application</p>
        <p className="text-sm text-gray-500">Please verify the entered data before submitting.</p>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3 text-sm">
        <h3 className="font-semibold text-slate-800 border-b pb-2">Household Information</h3>
        <p><span className="text-slate-500">Kebele:</span> <span className="font-medium text-slate-800">{householdSummary?.kebele}</span></p>
        <p><span className="text-slate-500">Village/Area:</span> <span className="font-medium text-slate-800">{householdSummary?.village || 'N/A'}</span></p>
        <p><span className="text-slate-500">Size:</span> <span className="font-medium text-slate-800">{householdSummary?.size}</span></p>
        <p><span className="text-slate-500">Reason:</span> <span className="font-medium text-slate-800">{householdSummary?.reason}</span></p>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3 text-sm">
        <h3 className="font-semibold text-slate-800 border-b pb-2">Household Members</h3>
        <ul className="space-y-2">
          {membersSummary?.map((m, i) => (
            <li key={i} className="flex justify-between">
              <span className="font-medium text-slate-800">{m.name}</span>
              <span className="text-slate-500">{m.rel} {i === 0 ? '(Head)' : ''}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between mt-8">
        <button className="btn-secondary" onClick={onBack}>Back</button>
        <button className="btn-primary" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  );
}
