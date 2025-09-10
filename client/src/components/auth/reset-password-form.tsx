import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordData } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

interface ResetPasswordFormProps {
  onLoginClick: () => void;
}

export default function ResetPasswordForm({ onLoginClick }: ResetPasswordFormProps) {
  const { resetPasswordMutation } = useAuth();

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ResetPasswordData) => {
    resetPasswordMutation.mutate(data);
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
                  type="email"
                  {...field} 
                  className="bg-background border-border text-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Отправка...
            </>
          ) : (
            "Отправить инструкцию"
          )}
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Вспомнили пароль?{" "}
            <Button 
              type="button" 
              variant="link" 
              className="p-0 text-primary hover:text-primary/90"
              onClick={onLoginClick}
            >
              Вернуться ко входу
            </Button>
          </p>
        </div>
      </form>
    </Form>
  );
}
