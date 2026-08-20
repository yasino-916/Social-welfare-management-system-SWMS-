import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Users, User, ArrowLeft, Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import { householdApi } from '@/services/api/householdApi';
import { documentApi } from '@/services/api/documentApi';
import apiClient from '@/services/api/client';

export default function HouseholdDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [household, setHousehold] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Member Form
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberData, setMemberData] = useState({
    full_name: '', gender: 'MALE', date_of_birth: '', national_id: '', relationship: ''
  });

  // Document Upload Form
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('GENERAL_SUPPORTING');
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [hhData, memData] = await Promise.all([
        householdApi.getById(id),
        householdApi.listMembers(id)
      ]);
      setHousehold(hhData);
      setMembers(memData);
    } catch (err: any) {
      toast.error('Failed to load household details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Create Person
      const { data: personRes } = await apiClient.post('/persons', {
        full_name: memberData.full_name,
        gender: memberData.gender,
        date_of_birth: memberData.date_of_birth || undefined,
        national_id: memberData.national_id || undefined,
      });

      // 2. Add to Household
      await householdApi.addMember(id!, {
        person_id: personRes.data.id,
        relationship_to_head: memberData.relationship,
        is_head: false,
      });

      toast.success('Member added successfully!');
      setIsMemberModalOpen(false);
      setMemberData({ full_name: '', gender: 'MALE', date_of_birth: '', national_id: '', relationship: '' });
      fetchData();
    } catch (err) {
      toast.error('Failed to add member.');
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile) return;
    try {
      setUploading(true);
      // We need to fetch the application associated with this household to upload a doc
      // For this implementation, we will query applications for this household.
      const { data: appsRes } = await apiClient.get('/applications', { params: { household_id: id } });
      const apps = appsRes.data;
      if (!apps || apps.length === 0) {
        toast.error('No active application found to attach document to.');
        return;
      }
      
      const formData = new FormData();
      formData.append('file', docFile);
      formData.append('application_id', apps[0].id);
      formData.append('document_type', docType);
      
      await documentApi.upload(formData);
      toast.success('Document uploaded successfully!');
      setIsDocModalOpen(false);
      setDocFile(null);
    } catch (err) {
      toast.error('Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!household) return <div className="p-10 text-center text-red-500">Household not found.</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link to="/households" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <PageHeader 
          title={`Household: ${household.id.substring(0, 8).toUpperCase()}`} 
          subtitle="Manage household details, family members, and supporting documents." 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Card */}
        <div className="card p-6 md:col-span-1 h-fit">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-400" /> Overview
          </h3>
          <div className="space-y-4 text-sm">
            <div><span className="block text-gray-500 text-xs uppercase tracking-wider">Kebele</span><span className="font-medium text-gray-900">{household.kebele_id}</span></div>
            <div><span className="block text-gray-500 text-xs uppercase tracking-wider">Village / Area</span><span className="font-medium text-gray-900">{household.village || 'N/A'}</span></div>
            <div><span className="block text-gray-500 text-xs uppercase tracking-wider">Household Size</span><span className="font-medium text-gray-900">{household.household_size}</span></div>
            <div>
              <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Status</span>
              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                {household.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
          
          <button onClick={() => setIsDocModalOpen(true)} className="mt-8 btn-secondary w-full flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" /> Upload Document
          </button>
        </div>

        {/* Members List */}
        <div className="card p-0 md:col-span-2 overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" /> Family Members
            </h3>
            <button onClick={() => setIsMemberModalOpen(true)} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add Member
            </button>
          </div>
          
          <div className="divide-y">
            {members.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">No members registered yet.</div>
            ) : (
              members.map((m: any) => (
                <div key={m.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      {m.full_name} 
                      {m.is_head && <span className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-bold">HEAD</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex gap-3">
                      <span>Gender: {m.gender}</span>
                      <span>Relationship: {m.relationship_to_head}</span>
                      {m.national_id && <span>ID: {m.national_id}</span>}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Joined: {new Date(m.joined_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-5">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Add Family Member</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" required value={memberData.full_name} onChange={e => setMemberData({...memberData, full_name: e.target.value})} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select required value={memberData.gender} onChange={e => setMemberData({...memberData, gender: e.target.value})} className="input-field">
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship to Head *</label>
                  <input type="text" required placeholder="e.g. Spouse, Child" value={memberData.relationship} onChange={e => setMemberData({...memberData, relationship: e.target.value})} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input type="date" value={memberData.date_of_birth} onChange={e => setMemberData({...memberData, date_of_birth: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                  <input type="text" value={memberData.national_id} onChange={e => setMemberData({...memberData, national_id: e.target.value})} className="input-field" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsMemberModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isDocModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-5">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" /> Attach Document
            </h2>
            <form onSubmit={handleUploadDocument} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <select value={docType} onChange={e => setDocType(e.target.value)} className="input-field">
                  <option value="NATIONAL_ID_FRONT">National ID (Front)</option>
                  <option value="NATIONAL_ID_BACK">National ID (Back)</option>
                  <option value="GENERAL_SUPPORTING">General Supporting Doc</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                <input type="file" required accept="image/*,.pdf" onChange={e => setDocFile(e.target.files?.[0] || null)} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsDocModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={uploading || !docFile} className="btn-primary flex items-center gap-2">
                  <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
