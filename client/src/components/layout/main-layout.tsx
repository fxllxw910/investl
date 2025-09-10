import { ReactNode } from "react";
import { MainNavigation } from "./main-navigation";

export interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MainNavigation />
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-background border-t border-border py-10 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <img src="/logo.png" alt="ИНВЕСТ-ЛИЗИНГ" className="h-16 mb-4" />
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Осуществляем лизинговую деятельность с 2003 года<br />
              ИНН/КПП 4401060430/440101001
            </p>
            
            <div className="border-t border-border w-full max-w-xl mt-6 pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                © 2003-{new Date().getFullYear()} ООО «ИНВЕСТ-лизинг». Все права защищены.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};