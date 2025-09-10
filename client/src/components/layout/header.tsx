import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  BellIcon, UserCircle, KeyRound, LogOut, Menu, X, ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header = ({
  mobileMenuOpen,
  setMobileMenuOpen,
}: HeaderProps) => {
  const [, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Get user initials
  const getUserInitials = () => {
    if (!user || !user.username) return "U";
    const nameParts = user.username.split(/[.\s-_]/);
    if (nameParts.length > 1 && nameParts[0][0] && nameParts[1] && nameParts[1][0]) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return user.username.substring(0, Math.min(2, user.username.length)).toUpperCase();
  };

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/auth");
      },
    });
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle clicks on dropdowns
  const toggleProfileDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfileDropdownOpen(!profileDropdownOpen);
    setNotificationsOpen(false);
  };

  const toggleNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotificationsOpen(!notificationsOpen);
    setProfileDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  const closeDropdowns = () => {
    setProfileDropdownOpen(false);
    setNotificationsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-800 border-b border-border shadow-glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img src="/logo.png" alt="ИНВЕСТ-ЛИЗИНГ" className="h-10 mr-2" />
              <span className="ml-2 hidden md:inline-block text-lg font-semibold">Личный кабинет</span>
            </a>
          </div>

          <div className="flex items-center">
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden mr-2" 
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-muted-foreground" />
              )}
            </Button>

            {/* Notifications */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative mr-2" 
                onClick={toggleNotifications}
              >
                <BellIcon className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
              </Button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-xl overflow-hidden animate-fadeIn shadow-glass border border-border">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-medium">Уведомления</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-border hover:bg-muted/40 transition-all">
                      <p className="text-sm font-medium">Нет новых уведомлений</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-muted/40 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <span>{getUserInitials()}</span>
                  </div>
                  <span className="hidden md:inline-block text-sm">{user?.username}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-slate-800 rounded-xl overflow-hidden animate-fadeIn shadow-glass border border-border">
                <div className="p-4 border-b border-border">
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem asChild>
                  <a 
                    href="/profile" 
                    className="flex items-center p-3 hover:bg-muted/40 transition-all"
                  >
                    <UserCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                    Мой профиль
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a 
                    href="/change-password" 
                    className="flex items-center p-3 hover:bg-muted/40 transition-all"
                  >
                    <KeyRound className="h-4 w-4 mr-2 text-muted-foreground" />
                    Сменить пароль
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  className="text-destructive flex items-center p-3 hover:bg-muted/40 transition-all"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};