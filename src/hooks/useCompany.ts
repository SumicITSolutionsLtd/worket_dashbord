import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { companyService } from '../services/company.service';
import { extractErrorMessage } from '../lib/utils';

export function useMyCompanies() {
  return useQuery({
    queryKey: ['myCompanies'],
    queryFn: () => companyService.getMyCompanies(),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useCompany(id: number) {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => companyService.getCompany(id),
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => companyService.createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCompanies'] });
      toast.success('Company created successfully');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      companyService.updateCompany(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['myCompanies'] });
      queryClient.invalidateQueries({ queryKey: ['company', id] });
      toast.success('Company updated successfully');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => companyService.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCompanies'] });
      toast.success('Company deleted successfully');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}
