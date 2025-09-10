import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useAutoSync } from "@/hooks/use-auto-sync";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface CompanyData {
  id: number;
  userId: number;
  name: string;
  inn: string;
  kpp: string;
  ogrn: string;
  legalAddress: string;
}

interface ContactData {
  id: number;
  userId: number;
  name: string;
  managerEmail: string;
  email: string;
  phone: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Auto-sync documents when user first visits profile
  useAutoSync();
  
  // Fetch company profile data
  const { 
    data: company, 
    isLoading: isCompanyLoading 
  } = useQuery<CompanyData | null>({
    queryKey: ["/api/company"],
  });
  
  // Fetch contact information
  const {
    data: contact,
    isLoading: isContactLoading
  } = useQuery<ContactData | null>({
    queryKey: ["/api/contact"],
  });
  
  // Handle loading states
  const isLoading = isCompanyLoading || isContactLoading;

  return (
    <DashboardLayout>
      <div className="animate-fadeIn bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Мой профиль</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">Информация о компании</h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Наименование организации</p>
                    <p className="font-medium">{company?.name || "Нет данных"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ИНН</p>
                    <p className="font-medium">{company?.inn || user?.inn || "Нет данных"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">КПП</p>
                    <p className="font-medium">{company?.kpp || "Нет данных"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ОГРН</p>
                    <p className="font-medium">{company?.ogrn || "Нет данных"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Юридический адрес</p>
                    <p className="font-medium">{company?.legalAddress || "Нет данных"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">Контактная информация</h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">ФИО контактного лица</p>
                    <p className="font-medium">{contact?.name || "Нет данных"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Почта ответственного лица</p>
                    <p className="font-medium">{contact?.managerEmail || "Нет данных"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Электронная почта</p>
                    <p className="font-medium">{contact?.email || user?.email || "Нет данных"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Телефон</p>
                    <p className="font-medium">{contact?.phone || "Нет данных"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
