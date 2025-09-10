import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, RegistrationData } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface RegisterFormProps {
  onLoginClick: () => void;
}

export default function RegisterForm({ onLoginClick }: RegisterFormProps) {
  const { registerMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      email: "",
      inn: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegistrationData) => {
    registerMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="example@mail.ru" 
                  type="email"
                  {...field} 
                  className="bg-background border-border text-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="inn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ИНН</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Введите ИНН" 
                  {...field} 
                  className="bg-background border-border text-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Создайте пароль" 
                    {...field} 
                    className="bg-background border-border text-foreground pr-10"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div className="mt-1">
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
              <FormLabel>Подтверждение пароля</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Повторите пароль" 
                    {...field} 
                    className="bg-background border-border text-foreground pr-10"
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
          className="w-full mt-6" 
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Регистрация...
            </>
          ) : (
            "Зарегистрироваться"
          )}
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Button 
              type="button" 
              variant="link" 
              className="p-0 text-primary hover:text-primary/90"
              onClick={onLoginClick}
            >
              Войти
            </Button>
          </p>
        </div>
      </form>
    </Form>
  );
}
