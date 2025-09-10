import { ReactNode, useState } from "react";
import { Header } from "./header";
import { SidebarNavigation } from "./sidebar-navigation";

export interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      
      <main className="container mx-auto flex flex-col md:flex-row">
        {/* Sidebar - Mobile version is controlled by state */}
        <SidebarNavigation 
          mobileMenuOpen={mobileMenuOpen} 
          setMobileMenuOpen={setMobileMenuOpen} 
        />
        
        {/* Main Content */}
        <section className="flex-grow p-4">
          {children}
        </section>
      </main>
    </div>
  );
};
