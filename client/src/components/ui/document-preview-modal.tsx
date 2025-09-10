import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, FileIcon } from "lucide-react";

export interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  documentPath?: string;
  documentName: string;
}

export function DocumentPreviewModal({
  isOpen,
  onClose,
  title,
  documentPath,
  documentName,
}: DocumentPreviewModalProps) {
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Handle document download
  const handleDownload = async () => {
    if (!documentPath) {
      return;
    }
    
    try {
      // Extract document info from the title and path
      let documentType = 'other';
      let documentId = '1';
      
      if (title.includes('Договор')) {
        documentType = 'contract';
      } else if (title.includes('Акт')) {
        documentType = 'act';
      } else if (title.includes('Счет')) {
        documentType = 'invoice';
      }
      
      // Extract ID from document name or path if possible
      const idMatch = documentName.match(/(\d+)_/) || documentPath.match(/(\d+)_/);
      if (idMatch) {
        documentId = idMatch[1];
      }
      
      const response = await fetch(`/api/download-document?id=${documentId}&type=${documentType}`);
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки документа');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = documentName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass rounded-xl max-w-4xl w-full h-[80vh] p-0 border border-border shadow-glass">
        <DialogHeader className="flex items-center justify-between p-4 border-b border-border">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex-grow overflow-auto p-4 h-[calc(80vh-5rem)]">
          {documentPath ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="mb-4">
                  <FileIcon className="w-16 h-16 text-primary mx-auto" />
                </div>
                <p className="text-muted-foreground mb-4">
                  Предпросмотр документа будет доступен здесь
                </p>
                <Button 
                  variant="secondary" 
                  className="flex items-center gap-2"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  Скачать документ
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">
                Документ недоступен для предпросмотра
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
