import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default function Footer() {
  const { t, isRTL } = useLanguage();
  
  return (
    <footer className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <svg className="h-8 w-auto text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L2 8L12 12L22 8L12 4Z" fill="currentColor"/>
              <path d="M2 12L12 16L22 12" fill="currentColor"/>
              <path d="M2 16L12 20L22 16" fill="currentColor"/>
            </svg>
            <span className={`text-xl font-bold text-primary-600 dark:text-primary-400 ${isRTL ? 'mr-2' : 'ml-2'}`}>
              Kalima
            </span>
          </div>
          
          <nav className={`flex flex-wrap justify-center ${isRTL ? 'space-x-reverse' : ''} space-x-6 mb-4 md:mb-0`}>
            <Link href="/" className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400">
              {t("nav.home")}
            </Link>
            <Link href="/categories" className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400">
              {t("nav.categories")}
            </Link>
            <Link href="/favorites" className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400">
              {t("nav.favorites")}
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
        
        <div className="mt-8 border-t border-neutral-200 dark:border-neutral-700 pt-8 text-center text-neutral-600 dark:text-neutral-300 text-sm">
          <p>© {new Date().getFullYear()} Kalima. {t("footer.rightsReserved")}</p>
          <p className="mt-2">{t("footer.description")}</p>
        </div>
      </div>
    </footer>
  );
}
