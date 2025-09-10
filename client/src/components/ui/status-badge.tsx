import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = () => {
    switch (status.toLowerCase()) {
      case "активен":
      case "оплачен":
        return "success";
      case "ожидает оплаты":
      case "ожидается":
        return "warning";
      case "завершен":
        return "neutral";
      case "отменен":
        return "destructive";
      default:
        return "neutral";
    }
  };

  return (
    <Badge variant={getVariant()} className={className}>
      {status}
    </Badge>
  );
}
