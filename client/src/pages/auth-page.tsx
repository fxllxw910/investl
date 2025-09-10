import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import ResetPasswordForm from "@/components/auth/reset-password-form";

const AuthPage = () => {
  const [activeForm, setActiveForm] = useState<"login" | "register" | "reset">("login");
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // If user is already logged in, redirect to the dashboard
  useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-0 bg-background text-foreground">
      <div className="animate-fadeIn">
        {activeForm === "login" && (
          <Card className="w-full max-w-md mx-auto bg-slate-800 border border-border mb-8 rounded-xl shadow-glass">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-8">
                <h1 className="text-2xl font-semibold text-center">ИНВЕСТ-лизинг</h1>
              </div>
              
              <h2 className="text-2xl font-semibold text-center mb-6">Вход в личный кабинет</h2>
              
              <LoginForm 
                onRegisterClick={() => setActiveForm("register")}
                onResetClick={() => setActiveForm("reset")}
              />
            </CardContent>
          </Card>
        )}

        {activeForm === "register" && (
          <Card className="w-full max-w-md mx-auto bg-slate-800 border border-border mb-8 rounded-xl shadow-glass">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Регистрация</h2>
                <button 
                  className="text-muted-foreground hover:text-foreground transition-all" 
                  onClick={() => setActiveForm("login")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>
              
              <RegisterForm onLoginClick={() => setActiveForm("login")} />
            </CardContent>
          </Card>
        )}

        {activeForm === "reset" && (
          <Card className="w-full max-w-md mx-auto bg-slate-800 border border-border mb-8 rounded-xl shadow-glass">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Восстановление пароля</h2>
                <button 
                  className="text-muted-foreground hover:text-foreground transition-all" 
                  onClick={() => setActiveForm("login")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Введите ваш email, и мы отправим вам инструкции по восстановлению пароля.
              </p>
              
              <ResetPasswordForm onLoginClick={() => setActiveForm("login")} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
