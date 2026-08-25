import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import apiClient from '@/services/api/client';
import { householdApi } from '@/services/api/householdApi';


export default function AssistedRegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    kebele_id: '',
    village: '',
    household_size: 1,
    registration_reason_id: '',
    other_reason_description: '',
    head_name: '',
    head_gender: 'MALE',
    head_dob: '',
    head_national_id: '',
  });

  const { data: kebeles } = useQuery({
    queryKey: ['adminKebeles'],
    queryFn: async () => {
      const { data } = await apiClient.get('/kebeles');
      return data.data;
    }
  });

  const { data: reasonsList } = useQuery({
    queryKey: ['reasons'],
    queryFn: async () => {
      const { data } = await apiClient.get('/public/registration-reasons');
      return data.data;
    }
  });

  const selectedReasonObj = reasonsList?.find((r: any) => r.id === formData.registration_reason_id);
  const requiresOther = selectedReasonObj?.code === 'other' || selectedReasonObj?.requires_description;

  const mutation = useMutation({
    mutationFn: async () => {
      // 1. Create person (Head)
      const { data: personRes } = await apiClient.post('/persons', {
        full_name: formData.head_name,
        gender: formData.head_gender,
        date_of_birth: formData.head_dob || undefined,
        national_id: formData.head_national_id || undefined,
      });
      const headId = personRes.data.id;

      // 2. Create household
      const hh = await householdApi.create({
        kebele_id: formData.kebele_id || undefined,
        village: formData.village,
        household_size: formData.household_size,
        registration_reason_id: formData.registration_reason_id,
        other_reason_description: requiresOther ? formData.other_reason_description : undefined,
      });

      // 3. Add head to household
      await householdApi.addMember(hh.id, {
        person_id: headId,
        relationship_to_head: 'Head',
        is_head: true,
      });

      // 4. Submit application automatically
      await apiClient.post('/applications/public', { household_id: hh.id });

      return hh;
    },
    onSuccess: () => {
      toast.success('Registration successful! Application submitted.');
      navigate('/households');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to complete registration.');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader 
        title="Assisted Registration" 
        subtitle="Register a household and submit their application on behalf of a citizen." 
      />

      <div className="card p-6">
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-8">
          
          {/* Household Details */}
          <div>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">1. Household Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kebele (Optional for Kebele Admins)</label>
                <select name="kebele_id" value={formData.kebele_id} onChange={handleChange} className="input-field">
                  <option value="">Select Kebele...</option>
                  {kebeles?.map((k: any) => <option key={k.id} value={k.id}>{k.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Village / Area</label>
                <input type="text" name="village" value={formData.village} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Household Size *</label>
                <input type="number" min={1} required name="household_size" value={formData.household_size} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Reason *</label>
                <select required name="registration_reason_id" value={formData.registration_reason_id} onChange={handleChange} className="input-field">
                  <option value="">Select Reason...</option>
                  {reasonsList?.map((r: any) => <option key={r.id} value={r.id}>{r.label_en}</option>)}
                </select>
              </div>
              {requiresOther && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Describe the reason *</label>
                  <input type="text" required name="other_reason_description" value={formData.other_reason_description} onChange={handleChange} className="input-field" />
                </div>
              )}
            </div>
          </div>

          {/* Head of Household Details */}
          <div>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">2. Head of Household Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" required name="head_name" value={formData.head_name} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select required name="head_gender" value={formData.head_gender} onChange={handleChange} className="input-field">
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" name="head_dob" value={formData.head_dob} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">National ID Number</label>
                <input type="text" name="head_national_id" value={formData.head_national_id} onChange={handleChange} className="input-field" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              className="btn-primary flex items-center gap-2"
              disabled={mutation.isPending || !formData.household_size || !formData.registration_reason_id || !formData.head_name}
            >
              <Save className="w-4 h-4" />
              {mutation.isPending ? 'Registering...' : 'Register Household'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
