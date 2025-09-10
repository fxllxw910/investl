import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { isAuthenticated } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 glass">
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center" onClick={onClose}>
            <span className="text-lg font-bold text-white">ИНВЕСТ<span className="text-primary">-лизинг</span></span>
          </Link>
          <Button variant="ghost" onClick={onClose} aria-label="Close menu">
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <nav className="flex flex-col space-y-4 mt-4">
          <Link href="/" className="text-lg font-medium text-white/90 hover:text-primary transition-colors py-2" onClick={onClose}>
            Главная
          </Link>
          <Link href="/services/spectechnika" className="text-lg font-medium text-white/90 hover:text-primary transition-colors py-2" onClick={onClose}>
            Услуги
          </Link>
          <Link href="/about" className="text-lg font-medium text-white/90 hover:text-primary transition-colors py-2" onClick={onClose}>
            О компании
          </Link>
          <Link href="/contacts" className="text-lg font-medium text-white/90 hover:text-primary transition-colors py-2" onClick={onClose}>
            Контакты
          </Link>
          <Link href="/partners" className="text-lg font-medium text-white/90 hover:text-primary transition-colors py-2" onClick={onClose}>
            Партнеры
          </Link>
          <Link href="/faq" className="text-lg font-medium text-white/90 hover:text-primary transition-colors py-2" onClick={onClose}>
            FAQ
          </Link>
        </nav>
        
        <div className="mt-auto py-4 space-y-2">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" onClick={onClose}>
                <Button className="w-full">Личный кабинет</Button>
              </Link>
              <Link href="/profile" onClick={onClose}>
                <Button variant="outline" className="w-full">Профиль</Button>
              </Link>
            </>
          ) : (
            <Link href="/auth" onClick={onClose}>
              <Button className="w-full">Войти</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
