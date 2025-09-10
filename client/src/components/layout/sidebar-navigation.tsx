import { useLocation } from "wouter";
import { 
  User, FileText, FileSpreadsheet, Receipt, Calendar, Folder, Key,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    label: "Договоры",
    href: "/contracts",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Акты",
    href: "/acts",
    icon: <FileSpreadsheet className="w-5 h-5" />,
  },
  {
    label: "Счета",
    href: "/invoices",
    icon: <Receipt className="w-5 h-5" />,
  },
  {
    label: "График платежей",
    href: "/payment-schedule",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    label: "Прочие документы",
    href: "/other-documents",
    icon: <Folder className="w-5 h-5" />,
  },
];

export interface SidebarNavigationProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const SidebarNavigation = ({
  mobileMenuOpen,
  setMobileMenuOpen,
}: SidebarNavigationProps) => {
  const [location] = useLocation();
  
  // Function to close mobile menu when a link is clicked
  const handleNavClick = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <aside className={`
      w-full md:w-64 bg-white/10 backdrop-blur-md border border-white/20 
      my-4 mx-4 rounded-xl h-auto md:h-[calc(100vh-5rem)] flex-shrink-0 shadow-lg
      ${mobileMenuOpen ? 'block' : 'hidden md:block'}
    `}>
      <nav className="p-2">
        <ul>
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`
                    flex items-center p-3 rounded-lg hover:bg-muted/40 transition-all mb-1
                    ${isActive ? 'bg-primary/10 border-l-4 border-primary text-primary' : 'text-foreground'}
                  `}
                  onClick={handleNavClick}
                >
                  <span className={`w-6 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {item.icon}
                  </span>
                  <span className="ml-2">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
