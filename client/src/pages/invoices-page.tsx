import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { DocumentPreviewModal } from "@/components/ui/document-preview-modal";
import { useSyncDocuments } from "@/hooks/use-sync-documents";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Filter, Download, RefreshCw } from "lucide-react";

interface Invoice {
  id: number;
  userId: number;
  number: string;
  type: string;
  contractNumber: string;
  filePath?: string;
}

const InvoicesPage = () => {
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();
  
  // Fetch invoices data
  const { data: invoices, isLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices"],
  });
  
  // Sync documents hook
  const syncDocuments = useSyncDocuments();
  
  // Filter invoices based on search term
  const filteredInvoices = invoices?.filter(invoice => 
    invoice.number.toLowerCase().includes(search.toLowerCase()) ||
    invoice.type.toLowerCase().includes(search.toLowerCase()) ||
    invoice.contractNumber.toLowerCase().includes(search.toLowerCase())
  ) || [];
  
  // Calculate pagination
  const totalPages = Math.ceil((filteredInvoices?.length || 0) / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle preview
  const handlePreview = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
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
      a.download = `Счет_${documentId}.pdf`;
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

  return (
    <DashboardLayout>
      <Card className="animate-fadeIn glass rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Счета</h2>
          
          <div className="flex">
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
                { id: "number", label: "№ счета", align: "center" },
                { id: "type", label: "Тип", align: "center" },
                { id: "actions", label: "Действия", align: "center" }
              ]}
              data={paginatedInvoices}
              renderRow={(invoice) => (
                <tr key={invoice.id} className="border-b border-border hover:bg-muted/40 transition-all">
                  <td className="p-3 text-center">{invoice.number}</td>
                  <td className="p-3 text-center">{invoice.type}</td>
                  <td className="p-3 text-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-primary hover:text-primary-foreground hover:bg-primary"
                      onClick={() => handleDownload(invoice.id, 'invoice')}
                      aria-label="Скачать"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              )}
            />
            
            {filteredInvoices.length > 0 ? (
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Показано {paginatedInvoices.length} из {filteredInvoices.length} счетов
                </p>
                
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                Счета не найдены
              </div>
            )}
          </>
        )}
      </Card>
      
      {selectedInvoice && (
        <DocumentPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={`Счет ${selectedInvoice.number}`}
          documentPath={selectedInvoice.filePath}
          documentName={`Счет_${selectedInvoice.number}.pdf`}
        />
      )}
    </DashboardLayout>
  );
};

export default InvoicesPage;