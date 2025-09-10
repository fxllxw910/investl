import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginData } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface LoginFormProps {
  onRegisterClick: () => void;
  onResetClick: () => void;
}

export default function LoginForm({ onRegisterClick, onResetClick }: LoginFormProps) {
  const { loginMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="example@mail.ru" 
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
                    placeholder="Введите пароль" 
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
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember" 
              checked={rememberMe} 
              onCheckedChange={(checked) => setRememberMe(!!checked)} 
            />
            <label 
              htmlFor="remember" 
              className="text-sm font-medium text-muted-foreground cursor-pointer"
            >
              Запомнить меня
            </label>
          </div>
          
          <Button 
            type="button" 
            variant="link" 
            className="p-0 text-primary hover:text-primary/90"
            onClick={onResetClick}
          >
            Забыли пароль?
          </Button>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Вход...
            </>
          ) : (
            "Войти"
          )}
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Еще нет аккаунта?{" "}
            <Button 
              type="button" 
              variant="link" 
              className="p-0 text-primary hover:text-primary/90"
              onClick={onRegisterClick}
            >
              Зарегистрироваться
            </Button>
          </p>
        </div>
      </form>
    </Form>
  );
}
