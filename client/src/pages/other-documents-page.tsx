import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DocumentCard } from "@/components/ui/document-card";
import { DocumentPreviewModal } from "@/components/ui/document-preview-modal";
import { Loader2, Search, Filter } from "lucide-react";

interface OtherDocument {
  id: number;
  userId: number;
  name: string;
  date: string;
  description: string;
  fileSize: number;
  fileType: string;
  filePath?: string;
}

const OtherDocumentsPage = () => {
  const [search, setSearch] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<OtherDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Fetch documents data
  const { data: documents, isLoading } = useQuery<OtherDocument[]>({
    queryKey: ["/api/other-documents"],
  });
  
  // Filter documents based on search term
  const filteredDocuments = documents?.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.description.toLowerCase().includes(search.toLowerCase()) ||
    doc.fileType.toLowerCase().includes(search.toLowerCase())
  ) || [];

  // Handle preview
  const handlePreview = (document: OtherDocument) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };
  
  // Format file size
  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} Б`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} КБ`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} МБ`;
    }
  };

  return (
    <DashboardLayout>
      <Card className="animate-fadeIn glass rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Прочие документы</h2>
          
          <div className="flex">
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
            {filteredDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map(document => (
                  <DocumentCard
                    key={document.id}
                    document={{
                      id: document.id,
                      name: document.name,
                      date: formatDate(document.date),
                      description: document.description,
                      fileSize: formatFileSize(document.fileSize),
                      fileType: document.fileType,
                      filePath: document.filePath,
                    }}
                    onPreview={() => handlePreview(document)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                Документы не найдены
              </div>
            )}
          </>
        )}
      </Card>
      
      {selectedDocument && (
        <DocumentPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={selectedDocument.name}
          documentPath={selectedDocument.filePath}
          documentName={selectedDocument.name}
        />
      )}
    </DashboardLayout>
  );
};

export default OtherDocumentsPage;
