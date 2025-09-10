import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Menu, ChevronDown } from "lucide-react";
import { MobileMenu } from "./mobile-menu";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    return location === path || location.startsWith(path + '/');
  };

  const toggleServicesDropdown = () => {
    setServicesDropdownOpen(!servicesDropdownOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass shadow-glass">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="ИНВЕСТ-лизинг" className="h-8 mr-2" />
              <span className="text-lg font-bold text-white">ИНВЕСТ<span className="text-primary">-лизинг</span></span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className={`${isActive('/') ? 'text-primary' : 'text-white/90 hover:text-primary'} transition-colors`}>
                Главная
              </Link>
              
              {/* Услуги с выпадающим меню */}
              <div className="relative">
                <button 
                  className={`flex items-center ${isActive('/services') ? 'text-primary' : 'text-white/90 hover:text-primary'} transition-colors`}
                  onClick={toggleServicesDropdown}
                >
                  Услуги <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                
                {servicesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-background/90 backdrop-blur-md rounded-md shadow-lg border border-border overflow-hidden z-50">
                    <Link href="/services/spectechnika" className="block px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary">
                      Спецтехника
                    </Link>
                    <Link href="/services/oborudovanie" className="block px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary">
                      Оборудование
                    </Link>
                    <Link href="/services/nedvijimost" className="block px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary">
                      Недвижимость
                    </Link>
                    <Link href="/services/gruzovye-avtomobili" className="block px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary">
                      Грузовые автомобили
                    </Link>
                  </div>
                )}
              </div>
              
              <Link href="/about" className={`${isActive('/about') ? 'text-primary' : 'text-white/90 hover:text-primary'} transition-colors`}>
                О компании
              </Link>
              <Link href="/contacts" className={`${isActive('/contacts') ? 'text-primary' : 'text-white/90 hover:text-primary'} transition-colors`}>
                Контакты
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block mr-2">
                <input 
                  type="text" 
                  placeholder="Поиск" 
                  className="px-3 py-1 rounded-md text-sm bg-background/50 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <Link href="/auth">
                <Button variant="outline" className="hidden md:inline-flex">
                  Личный кабинет
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                className="md:hidden" 
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
