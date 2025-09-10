import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SyncResponse {
  success: boolean;
  count: number;
  message: string;
}

export function useSyncDocuments() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (): Promise<SyncResponse> => {
      return await apiRequest("POST", "/api/sync-documents");
    },
    onSuccess: (data) => {
      // Invalidate all document-related queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/acts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/other-documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payment-schedules"] });
      
      toast({
        title: "Синхронизация завершена",
        description: `Загружено ${data.count || 0} документов с FTP сервера`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка синхронизации",
        description: error.message || "Не удалось синхронизировать документы с FTP сервера",
        variant: "destructive",
      });
    },
  });
}