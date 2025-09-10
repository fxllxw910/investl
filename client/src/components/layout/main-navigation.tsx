import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type DropdownItem = {
  name: string;
  href: string;
};

type NavItem = {
  name: string;
  href: string;
  dropdown?: DropdownItem[];
}; 

export const MainNavigation = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const navItems: NavItem[] = [
    { name: "Главная", href: "/" },
    { name: "О компании", href: "/about" },
    { 
      name: "Услуги", 
      href: "#services", 
      dropdown: [
        { name: "Спецтехника", href: "/services/spectechnika" },
        { name: "Оборудование", href: "/services/oborudovanie" },
        { name: "Недвижимость", href: "/services/nedvijimost" },
        { name: "Легковые и грузовые автомобили", href: "/services/gruzovye-avtomobili" }
      ]
    },
    { 
      name: "Клиентам", 
      href: "#clients", 
      dropdown: [
        { name: "Вакансии", href: "/clients/vacancies" },
        { name: "Партнеры", href: "/partners" },
        { name: "F.A.Q.", href: "/faq" },
        { name: "Документы", href: "/clients/documents" },
        { name: "Реализация имущества", href: "/clients/property" }
      ]
    },
    { name: "Контакты", href: "/contacts" }
  ];

  // Dummy data for services, replace with actual data if needed for the dropdown
  const services = [
    { title: "Спецтехника", description: "Аренда спецтехники", href: "/services/spectechnika" },
    { title: "Оборудование", description: "Продажа и аренда оборудования", href: "/services/oborudovanie" },
    { title: "Недвижимость", description: "Услуги с недвижимостью", href: "/services/nedvijimost" },
    { title: "Легковые и грузовые автомобили", description: "Продажа и лизинг автомобилей", href: "/services/gruzovye-avtomobili" },
  ];

  return (
    <nav className="py-4 glass backdrop-blur-md bg-background/50 border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="ИНВЕСТ-ЛИЗИНГ" className="h-12 mr-2" />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => 
              item.dropdown ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger className="flex items-center text-sm font-medium text-foreground hover:text-primary focus:outline-none">
                    {item.name} <ChevronDown className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-60">
                    {item.dropdown.map((dropdownItem) => (
                      <DropdownMenuItem key={dropdownItem.name} asChild>
                        <Link 
                          href={dropdownItem.href} 
                          className="cursor-pointer"
                        >
                          {dropdownItem.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    location === item.href 
                      ? "text-primary" 
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* CTA button for desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="glass">
                  Личный кабинет
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button variant="glass">
                  Личный кабинет
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="glass" size="sm">
                  Личный кабинет
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button variant="glass" size="sm">
                  Личный кабинет
                </Button>
              </Link>
            )}
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <Link 
                      href="/" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center"
                    >
                      <img src="/logo.png" alt="ИНВЕСТ-ЛИЗИНГ" className="h-10 mr-2" />
                    </Link>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-6 w-6" />
                      </Button>
                    </SheetClose>
                  </div>

                  <div className="flex flex-col space-y-6">
                    {navItems.map((item) => 
                      item.dropdown ? (
                        <div key={item.name} className="space-y-3">
                          <div className="text-lg font-medium text-foreground">
                            {item.name}
                          </div>
                          <div className="pl-4 space-y-2 border-l-2 border-primary/30">
                            {item.dropdown.map((dropdownItem) => (
                              <SheetClose key={dropdownItem.name} asChild>
                                <Link 
                                  href={dropdownItem.href}
                                  className="block text-base text-foreground/80 hover:text-primary"
                                >
                                  {dropdownItem.name}
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <SheetClose key={item.name} asChild>
                          <Link 
                            href={item.href}
                            className={`text-lg font-medium transition-colors ${
                              location === item.href 
                                ? "text-primary" 
                                : "text-foreground hover:text-primary"
                            }`}
                          >
                            {item.name}
                          </Link>
                        </SheetClose>
                      )
                    )}
                  </div>

                  <div className="mt-auto pt-8">
                    <SheetClose asChild>
                      {isAuthenticated ? (
                        <Button asChild variant="glass" className="w-full">
                          <Link href="/dashboard">
                            Личный кабинет
                          </Link>
                        </Button>
                      ) : (
                        <Button asChild variant="glass" className="w-full">
                          <Link href="/auth">
                            Личный кабинет
                          </Link>
                        </Button>
                      )}
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};