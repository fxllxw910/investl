
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Download, Eye, FileIcon, FileTextIcon, FileSpreadsheetIcon } from "lucide-react";

export interface Document {
  id: number;
  name: string;
  date: string;
  description: string;
  fileSize: string;
  fileType: string;
  filePath?: string;
}

export interface DocumentCardProps {
  document: Document;
  onPreview: () => void;
  className?: string;
}

export function DocumentCard({ document, onPreview, className }: DocumentCardProps) {
  const { toast } = useToast();

  const getFileIcon = () => {
    if (document.fileType.includes('pdf')) {
      return <FileIcon className="h-8 w-8 text-red-500" />;
    } else if (document.fileType.includes('doc') || document.fileType.includes('docx')) {
      return <FileTextIcon className="h-8 w-8 text-blue-500" />;
    } else if (document.fileType.includes('xls') || document.fileType.includes('xlsx')) {
      return <FileSpreadsheetIcon className="h-8 w-8 text-green-500" />;
    }
    return <FileIcon className="h-8 w-8 text-gray-500" />;
  };

  const handleDownload = async () => {
    try {
      const response = await apiRequest("GET", `/api/download-document?id=${document.id}&type=other-document`);
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки документа');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = document.name;
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
    <Card className={cn("glass rounded-xl transition-all hover:shadow-lg", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {getFileIcon()}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{document.name}</h3>
              <p className="text-sm text-muted-foreground">{document.date}</p>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {document.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {document.fileSize} • {document.fileType}
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary hover:text-primary-foreground hover:bg-primary"
              onClick={handleDownload}
              aria-label="Скачать"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary hover:text-primary-foreground hover:bg-primary"
              onClick={onPreview}
              aria-label="Просмотреть"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
