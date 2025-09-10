import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface PaymentSchedule {
  id: number;
  userId: number;
  paymentNumber: number;
  paymentDate: string;
  contractNumber: string;
  amount: number;
}

interface Contract {
  id: number;
  number: string;
}

const PaymentSchedulePage = () => {
  const [selectedContract, setSelectedContract] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Fetch contracts for filter dropdown
  const { data: contracts, isLoading: isContractsLoading } = useQuery<Contract[]>({
    queryKey: ["/api/contracts"],
  });
  
  // Fetch payment schedules data
  const { data: payments, isLoading: isPaymentsLoading } = useQuery<PaymentSchedule[]>({
    queryKey: ["/api/payment-schedules", selectedContract ? { contractNumber: selectedContract } : {}],
  });
  
  // Calculate pagination
  const totalPages = Math.ceil((payments?.length || 0) / itemsPerPage);
  const paginatedPayments = payments?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];
  
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };
  
  // Format amount
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount);
  };
  
  // Handle contract selection
  const handleContractChange = (value: string) => {
    setSelectedContract(value === "all" ? "" : value);
    setCurrentPage(1);
  };
  
  // Loading state
  const isLoading = isContractsLoading || isPaymentsLoading;

  return (
    <DashboardLayout>
      <Card className="animate-fadeIn glass rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">График платежей</h2>
          
          <div className="flex">
            <div className="relative w-64">
              <Select value={selectedContract} onValueChange={handleContractChange}>
                <SelectTrigger className="bg-background border border-border">
                  <SelectValue placeholder="Все договоры" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все договоры</SelectItem>
                  {contracts?.map(contract => (
                    <SelectItem key={contract.id} value={contract.number}>
                      {contract.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                { id: "paymentNumber", label: "№ платежа", align: "center" },
                { id: "paymentDate", label: "Дата платежа", align: "center" },
                { id: "contractNumber", label: "Договор", align: "center" },
                { id: "amount", label: "Сумма, ₽", align: "center" }
              ]}
              data={paginatedPayments}
              renderRow={(payment) => (
                <tr key={payment.id} className="border-b border-border hover:bg-muted/40 transition-all">
                  <td className="p-3 text-center">{payment.paymentNumber}</td>
                  <td className="p-3 text-center">{formatDate(payment.paymentDate)}</td>
                  <td className="p-3 text-center">{payment.contractNumber}</td>
                  <td className="p-3 text-center">{formatAmount(payment.amount)}</td>
                </tr>
              )}
            />
            
            {payments && payments.length > 0 ? (
              <>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Показано {paginatedPayments.length} из {payments.length} платежей
                  </p>
                  
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
                
              </>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                График платежей не найден
              </div>
            )}
          </>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default PaymentSchedulePage;
