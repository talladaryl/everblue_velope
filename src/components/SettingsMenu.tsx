import React, { useState } from "react";
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
import { Moon, Sun, Globe } from "lucide-react";

export const SettingsMenu: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        title="Settings"
      >
        <div className="flex items-center gap-2">
          {theme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          <Globe className="h-5 w-5" />
        </div>
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
  );
};
