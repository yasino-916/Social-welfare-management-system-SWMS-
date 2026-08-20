import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationApi } from '@/services/api/applicationApi';
import toast from 'react-hot-toast';

export function useApplications(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['applications', params],
    queryFn: () => applicationApi.list(params),
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ['applications', id],
    queryFn: () => applicationApi.getById(id),
    enabled: !!id,
  });
}

export function useDecisionHistory(applicationId: string) {
  return useQuery({
    queryKey: ['decisions', applicationId],
    queryFn: () => applicationApi.getDecisionHistory(applicationId),
    enabled: !!applicationId,
  });
}

export function useKebeleDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { decision_type: string; reason?: string } }) =>
      applicationApi.kebeleDecision(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Decision recorded');
    },
    onError: () => toast.error('Failed to record decision'),
  });
}

export function useWeredaDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { decision_type: string; reason?: string } }) =>
      applicationApi.weredaDecision(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Final decision recorded');
    },
    onError: () => toast.error('Failed to record decision'),
  });
}

export function useBatchDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: applicationApi.batchDecision,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Batch decision applied');
    },
    onError: () => toast.error('Batch decision failed'),
  });
}

export function useSubmitToWereda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: applicationApi.submitToWereda,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Applications submitted to Wereda');
    },
    onError: () => toast.error('Submission failed'),
  });
}
