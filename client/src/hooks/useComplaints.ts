import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintApi } from '@/services/api/complaintApi';
import toast from 'react-hot-toast';

export function useComplaints(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['complaints', params],
    queryFn: () => complaintApi.list(params),
  });
}

export function useComplaint(id: string) {
  return useQuery({
    queryKey: ['complaints', id],
    queryFn: () => complaintApi.getById(id),
    enabled: !!id,
  });
}

export function useAssignComplaint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, assigned_to }: { id: string; assigned_to: string }) =>
      complaintApi.assign(id, assigned_to),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['complaints'] }); toast.success('Complaint assigned'); },
    onError: () => toast.error('Failed to assign complaint'),
  });
}

export function useEscalateComplaint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      complaintApi.escalate(id, reason),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['complaints'] }); toast.success('Complaint escalated'); },
    onError: () => toast.error('Failed to escalate complaint'),
  });
}

export function useResolveComplaint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, resolution }: { id: string; resolution: string }) =>
      complaintApi.resolve(id, resolution),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['complaints'] }); toast.success('Complaint resolved'); },
    onError: () => toast.error('Failed to resolve complaint'),
  });
}

export function useCloseComplaint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => complaintApi.close(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['complaints'] }); toast.success('Complaint closed'); },
    onError: () => toast.error('Failed to close complaint'),
  });
}
