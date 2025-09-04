import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const useTransactions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: transactionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionAPI.getAll(),
  });

  const {
    data: statsData,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ['transaction-stats'],
    queryFn: () => transactionAPI.getStats(),
  });

  const createMutation = useMutation({
    mutationFn: transactionAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-stats'] });
      toast({
        title: 'Success',
        description: 'Transaction created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create transaction',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      transactionAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-stats'] });
      toast({
        title: 'Success',
        description: 'Transaction updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update transaction',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: transactionAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-stats'] });
      toast({
        title: 'Success',
        description: 'Transaction deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete transaction',
        variant: 'destructive',
      });
    },
  });

  return {
    transactions: transactionsData?.transactions || [],
    stats: statsData?.stats || null,
    isLoading,
    statsLoading,
    error,
    createTransaction: createMutation.mutate,
    updateTransaction: updateMutation.mutate,
    deleteTransaction: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};