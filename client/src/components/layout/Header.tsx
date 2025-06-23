import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SearchDialog } from "@/components/ui/search-dialog";
import { Menu, X, Search, User, LogOut, Settings, BookOpen, Heart, MessageSquarePlus, LayoutDashboard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useLanguageFromUrl } from "@/hooks/use-language-from-url";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { language, t, setLanguage, isRTL } = useLanguage();
  const { user, logout, isAdmin } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const { pathWithoutLanguage, isLanguageInUrl } = useLanguageFromUrl();

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

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as Language);

    // Update URL to include new language
    if (location === "/" || location === `/${language}`) {
      // For home page, just go to new language home
      setLocation(`/${newLanguage}`);
    } else if (isLanguageInUrl) {
      // Replace existing language in URL
      const newPath = location.replace(`/${language}`, `/${newLanguage}`);
      setLocation(newPath);
    } else {
      // Add language prefix to current path
      const newPath = `/${newLanguage}${location}`;
      setLocation(newPath);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-accent/10 backdrop-blur-sm shadow-sm transition-theme">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
  <img
    src="/logo.png"
    alt="Kalima Logo"
    className="h-10 w-auto"
  />
</Link>

            {/* Desktop Navigation */}
            <nav className={`hidden md:flex md:space-x-6 ${isRTL ? 'md:space-x-reverse mr-6' : 'ml-6'}`}>
              <NavLink href={`/${language}`} active={isActive(`/${language}`)} label={t("nav.home")} />
              <NavLink href={`/${language}/categories`} active={isActive(`/${language}/categories`)} label={t("nav.categories")} />
              {user && (
                <NavLink href={`/${language}/favorites`} active={isActive(`/${language}/favorites`)} label={t("nav.favorites")} />
              )}
            </nav>
          </div>

          <div className="flex items-center">
            {/* Search Button */}
            <div className="hidden md:flex md:items-center mr-2">
              <SearchDialog />
            </div>

            {/* Language Switcher */}
            <div className="hidden md:flex md:items-center">
              <LanguageSwitcher onLanguageChange={handleLanguageChange} />
            </div>

            {/* Theme Toggle */}
            <div className="ml-2">
              <ThemeToggle />
            </div>

            {/* Admin Panel Button */}
            {user && isAdmin && (
              <Link href="/admin" className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <Button variant="outline" size="sm">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  {t("nav.adminPanel")}
                </Button>
              </Link>
            )}

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
                      <Link href={`/${language}/profile`}>{t("nav.profile")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/${language}/favorites`}>{t("nav.favorites")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/${language}/suggestions`}>{t("nav.suggestions")}</Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard">{t("nav.admin")}</Link>
                        </DropdownMenuItem>
                      </>
                    )}
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

            {/* Mobile Search Button */}
            <div className="md:hidden ml-2">
              <SearchDialog />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden ml-2">
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
              href={`/${language}`}
              active={isActive(`/${language}`)} 
              label={t("nav.home")} 
              onClick={() => setIsMenuOpen(false)} 
            />
            <MobileNavLink 
              href={`/${language}/categories`}
              active={isActive(`/${language}/categories`)} 
              label={t("nav.categories")}
              onClick={() => setIsMenuOpen(false)}
            />
            {user && (
              <MobileNavLink 
                href={`/${language}/favorites`}
                active={isActive(`/${language}/favorites`)} 
                label={t("nav.favorites")}
                onClick={() => setIsMenuOpen(false)}
              />
            )}
          </div>

          {/* Language Switcher (Mobile) */}
          <div className="pt-4 pb-3 border-t border-neutral-200 dark:border-neutral-700">
            <div className="px-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {t("language.selectLanguage")}
                </p>
                <LanguageSwitcher onLanguageChange={handleLanguageChange} />
              </div>
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