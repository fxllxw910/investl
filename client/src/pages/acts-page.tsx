import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { DocumentPreviewModal } from "@/components/ui/document-preview-modal";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSyncDocuments } from "@/hooks/use-sync-documents";
import { Loader2, Search, Filter, Download, Eye, FileText, RefreshCw } from "lucide-react";

interface Act {
  id: number;
  userId: number;
  number: string;
  date: string;
  type: string;
  contractNumber: string;
  amount: number;
  filePath?: string;
}

const ActsPage = () => {
  const [search, setSearch] = useState("");
  const [selectedAct, setSelectedAct] = useState<Act | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();
  
  // Fetch acts data
  const { data: acts, isLoading } = useQuery<Act[]>({
    queryKey: ["/api/acts"],
  });
  
  // Sync documents hook
  const syncDocuments = useSyncDocuments();
  
  // Request reconciliation act mutation
  const requestReconciliationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/acts/request-reconciliation", {});
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Запрос отправлен",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка запроса",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Filter acts based on search term
  const filteredActs = acts?.filter(act => 
    act.number.toLowerCase().includes(search.toLowerCase()) ||
    act.type.toLowerCase().includes(search.toLowerCase()) ||
    act.contractNumber.toLowerCase().includes(search.toLowerCase())
  ) || [];
  
  // Calculate pagination
  const totalPages = Math.ceil((filteredActs?.length || 0) / itemsPerPage);
  const paginatedActs = filteredActs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle preview
  const handlePreview = (act: Act) => {
    setSelectedAct(act);
    setIsPreviewOpen(true);
  };

  // Handle download
  const handleDownload = async (documentId: number, documentType: string) => {
    try {
      const response = await apiRequest("GET", `/api/download-document?id=${documentId}&type=${documentType}`);
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки документа');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Акт_${documentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Успешно",
        description: "Документ успешно скачан",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Ошибка загрузки документа",
        variant: "destructive",
      });
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };
  
  // Format amount
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount);
  };

  return (
    <DashboardLayout>
      <Card className="animate-fadeIn glass rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Акты</h2>
          
          <div className="flex">
            <Button 
              variant="default" 
              className="mr-2 flex items-center gap-2"
              onClick={() => requestReconciliationMutation.mutate()}
              disabled={requestReconciliationMutation.isPending}
            >
              {requestReconciliationMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              Заказать акт сверки
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 mr-2"
              onClick={() => syncDocuments.mutate()}
              disabled={syncDocuments.isPending}
            >
              <RefreshCw className={`h-4 w-4 ${syncDocuments.isPending ? 'animate-spin' : ''}`} />
              {syncDocuments.isPending ? 'Синхронизация...' : 'Синхронизировать'}
            </Button>
            
            <div className="relative mr-2">
              <Input
                type="text"
                placeholder="Поиск..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-10"
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Фильтры
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <DataTable
              headers={[
                { id: "contractNumber", label: "№ договора", align: "center" },
                { id: "type", label: "Тип", align: "center" },
                { id: "actions", label: "Действия", align: "center" }
              ]}
              data={paginatedActs}
              renderRow={(act) => (
                <tr key={act.id} className="border-b border-border hover:bg-muted/40 transition-all">
                  <td className="p-3 text-center">{act.contractNumber || act.number}</td>
                  <td className="p-3 text-center">{act.type}</td>
                  <td className="p-3 text-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-primary hover:text-primary-foreground hover:bg-primary"
                      onClick={() => handleDownload(act.id, 'act')}
                      aria-label="Скачать"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              )}
            />
            
            {filteredActs.length > 0 ? (
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Показано {paginatedActs.length} из {filteredActs.length} актов
                </p>
                
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                Акты не найдены
              </div>
            )}
          </>
        )}
      </Card>
      
      {selectedAct && (
        <DocumentPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={`Акт ${selectedAct.number}`}
          documentPath={selectedAct.filePath}
          documentName={`Акт_${selectedAct.number}.pdf`}
        />
      )}
    </DashboardLayout>
  );
};

export default ActsPage;
