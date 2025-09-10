import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ChangePasswordData, changePasswordSchema } from "@shared/schema";

const ChangePasswordPage = () => {
  const { changePasswordMutation } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordData) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <DashboardLayout>
      <Card className="animate-fadeIn glass rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-6">Смена пароля</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg space-y-6">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Текущий пароль</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showCurrentPassword ? "text" : "password"} 
                        placeholder="Введите текущий пароль" 
                        {...field} 
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-6 w-6"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Новый пароль</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showNewPassword ? "text" : "password"} 
                        placeholder="Введите новый пароль" 
                        {...field} 
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-6 w-6"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground mb-1">Требования к паролю:</div>
                    <ul className="text-xs text-muted-foreground list-disc pl-5">
                      <li>Минимум 8 символов</li>
                      <li>Хотя бы одна заглавная буква</li>
                      <li>Хотя бы одна цифра</li>
                      <li>Хотя бы один специальный символ</li>
                    </ul>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Подтверждение нового пароля</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Повторите новый пароль" 
                        {...field} 
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-6 w-6"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={changePasswordMutation.isPending}
              className="w-full sm:w-auto"
            >
              {changePasswordMutation.isPending ? "Сохранение..." : "Сменить пароль"}
            </Button>
          </form>
        </Form>
      </Card>
    </DashboardLayout>
  );
};

export default ChangePasswordPage;
