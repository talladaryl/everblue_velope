import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Globe, Settings } from "lucide-react";

export const HomePageTopBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Everblue
            </h1>
          </div>

          {/* Settings Menu */}
          <DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              title="Paramètres"
            >
              <Settings className="h-5 w-5" />
            </Button>

            <DropdownMenuContent align="end" className="w-56">
              {/* Thème */}
              <DropdownMenuLabel className="flex items-center gap-2">
                {theme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                {t("menu.theme")}
              </DropdownMenuLabel>

              <DropdownMenuCheckboxItem
                checked={theme === "light"}
                onCheckedChange={() => {
                  if (theme === "dark") toggleTheme();
                }}
                className="cursor-pointer"
              >
                <Sun className="h-4 w-4 mr-2" />
                {t("menu.light")}
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={theme === "dark"}
                onCheckedChange={() => {
                  if (theme === "light") toggleTheme();
                }}
                className="cursor-pointer"
              >
                <Moon className="h-4 w-4 mr-2" />
                {t("menu.dark")}
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />

              {/* Langue */}
              <DropdownMenuLabel className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {t("menu.language")}
              </DropdownMenuLabel>

              <DropdownMenuCheckboxItem
                checked={language === "en"}
                onCheckedChange={() => setLanguage("en")}
                className="cursor-pointer"
              >
                🇬🇧 English
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={language === "fr"}
                onCheckedChange={() => setLanguage("fr")}
                className="cursor-pointer"
              >
                🇫🇷 Français
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={language === "it"}
                onCheckedChange={() => setLanguage("it")}
                className="cursor-pointer"
              >
                🇮🇹 Italiano
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={language === "de"}
                onCheckedChange={() => setLanguage("de")}
                className="cursor-pointer"
              >
                🇩🇪 Deutsch
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
