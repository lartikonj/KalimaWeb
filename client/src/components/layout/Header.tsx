import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Menu, X, User, BookMarked } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, isRTL } = useLanguage();
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-neutral-800 shadow-sm transition-theme">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-auto text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L2 8L12 12L22 8L12 4Z" fill="currentColor"/>
                <path d="M2 12L12 16L22 12" fill="currentColor"/>
                <path d="M2 16L12 20L22 16" fill="currentColor"/>
              </svg>
              <span className={`ml-2 text-xl font-bold text-primary-600 dark:text-primary-400 ${isRTL ? 'mr-2 ml-0' : 'ml-2'}`}>
                Kalima
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className={`hidden md:flex md:space-x-6 ${isRTL ? 'md:space-x-reverse mr-6' : 'ml-6'}`}>
              <NavLink href="/" active={isActive('/')} label={t("nav.home")} />
              <NavLink href="/categories" active={isActive('/categories')} label={t("nav.categories")} />
              {user && (
                <NavLink href="/favorites" active={isActive('/favorites')} label={t("nav.favorites")} />
              )}
            </nav>
          </div>
          
          <div className="flex items-center">
            {/* Language Switcher */}
            <div className="hidden md:flex md:items-center">
              <LanguageSwitcher />
            </div>
            
            {/* Theme Toggle */}
            <div className="ml-2">
              <ThemeToggle />
            </div>
            
            {/* User Menu */}
            {user ? (
              <div className={`relative flex-shrink-0 ${isRTL ? 'mr-4' : 'ml-4'}`}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-500">
                        <User className="h-5 w-5 text-white" />
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">{t("nav.profile")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favorites">{t("nav.favorites")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/suggestions">{t("nav.suggestions")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      {t("auth.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <Link href="/login">
                  <Button size="sm">{t("auth.login")}</Button>
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-800 shadow-md">
          <div className="pt-2 pb-3 space-y-1">
            <MobileNavLink 
              href="/" 
              active={isActive('/')} 
              label={t("nav.home")} 
              onClick={() => setIsMenuOpen(false)} 
            />
            <MobileNavLink 
              href="/categories" 
              active={isActive('/categories')} 
              label={t("nav.categories")}
              onClick={() => setIsMenuOpen(false)}
            />
            {user && (
              <MobileNavLink 
                href="/favorites" 
                active={isActive('/favorites')} 
                label={t("nav.favorites")}
                onClick={() => setIsMenuOpen(false)}
              />
            )}
          </div>
          
          {/* Language Switcher (Mobile) */}
          <div className="pt-4 pb-3 border-t border-neutral-200 dark:border-neutral-700">
            <div className="px-4">
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                {t("language.selectLanguage")}
              </p>
            </div>
            <div className="mt-2 space-y-1">
              <MobileLanguageOption code="en" label="English" onClick={() => setIsMenuOpen(false)} />
              <MobileLanguageOption code="fr" label="Français" onClick={() => setIsMenuOpen(false)} />
              <MobileLanguageOption code="es" label="Español" onClick={() => setIsMenuOpen(false)} />
              <MobileLanguageOption code="de" label="Deutsch" onClick={() => setIsMenuOpen(false)} />
              <MobileLanguageOption code="ar" label="العربية" onClick={() => setIsMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

interface NavLinkProps {
  href: string;
  active: boolean;
  label: string;
}

function NavLink({ href, active, label }: NavLinkProps) {
  return (
    <Link 
      href={href} 
      className={`inline-flex items-center px-1 pt-1 border-b-2 ${
        active 
          ? 'border-primary-500 text-neutral-900 dark:text-neutral-100' 
          : 'border-transparent hover:border-primary-300 text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100'
      } text-sm font-medium`}
    >
      {label}
    </Link>
  );
}

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

function MobileNavLink({ href, active, label, onClick }: MobileNavLinkProps) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`block pl-3 pr-4 py-2 border-l-4 ${
        active 
          ? 'border-primary-500 text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
          : 'border-transparent text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
      } text-base font-medium`}
    >
      {label}
    </Link>
  );
}

interface MobileLanguageOptionProps {
  code: string;
  label: string;
  onClick: () => void;
}

function MobileLanguageOption({ code, label, onClick }: MobileLanguageOptionProps) {
  const { language, setLanguage } = useLanguage();
  
  const handleClick = () => {
    setLanguage(code as any);
    onClick();
  };
  
  return (
    <Button 
      variant="ghost" 
      className={`block w-full text-left px-4 py-2 text-base font-medium ${
        language === code 
          ? 'text-primary-700 dark:text-primary-400' 
          : 'text-neutral-600 dark:text-neutral-300'
      }`}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
}
