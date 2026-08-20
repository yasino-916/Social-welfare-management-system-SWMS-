import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@/services/api/searchApi';

export function useSearch() {
  const [params, setParams] = useState<Record<string, unknown> | null>(null);

  const query = useQuery({
    queryKey: ['search', params],
    queryFn: () => searchApi.search(params!),
    enabled: !!params && Object.values(params).some(Boolean),
  });

  return { ...query, setParams };
}
