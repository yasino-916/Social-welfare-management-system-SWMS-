import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { householdApi } from '@/services/api/householdApi';
import { Household, HouseholdMember } from '@/types';
import toast from 'react-hot-toast';

export function useHouseholds(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['households', params],
    queryFn: () => householdApi.list(params),
  });
}

export function useHousehold(id: string) {
  return useQuery({
    queryKey: ['households', id],
    queryFn: () => householdApi.getById(id),
    enabled: !!id,
  });
}

export function useHouseholdMembers(householdId: string) {
  return useQuery({
    queryKey: ['households', householdId, 'members'],
    queryFn: () => householdApi.listMembers(householdId),
    enabled: !!householdId,
  });
}

export function useCreateHousehold() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Household>) => householdApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['households'] });
      toast.success('Household created');
    },
    onError: () => toast.error('Failed to create household'),
  });
}

export function useAddMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ householdId, payload }: { householdId: string; payload: Partial<HouseholdMember> }) =>
      householdApi.addMember(householdId, payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['households', variables.householdId, 'members'] });
      toast.success('Member added');
    },
    onError: () => toast.error('Failed to add member'),
  });
}
