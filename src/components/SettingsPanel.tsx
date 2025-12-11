import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sun, Moon, Monitor } from "lucide-react";

export const SettingsPanel: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, availableLanguages } = useLanguage();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Préférences</CardTitle>
        <CardDescription>Personnalisez votre expérience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Thème */}
        <div className="space-y-3">
          <Label>Thème</Label>
          <RadioGroup
            value={theme}
            onValueChange={(value) => setTheme(value as "light" | "dark")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="theme-light" />
              <Label
                htmlFor="theme-light"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Sun className="h-4 w-4" />
                Clair
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="theme-dark" />
              <Label
                htmlFor="theme-dark"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Moon className="h-4 w-4" />
                Sombre
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="theme-system" />
              <Label
                htmlFor="theme-system"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Monitor className="h-4 w-4" />
                Système
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Langue */}
        <div className="space-y-3">
          <Label>Langue</Label>
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value as "fr" | "en")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une langue" />
            </SelectTrigger>
            <SelectContent>
              {availableLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    {lang.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Aperçu */}
        <div className="rounded-lg border border-border p-4 bg-card">
          <Label className="mb-2 block">Aperçu</Label>
          <div className="space-y-2">
            <div className="h-3 rounded-full bg-primary/20" />
            <div className="h-3 rounded-full bg-secondary/20 w-3/4" />
            <div className="h-3 rounded-full bg-muted/20 w-1/2" />
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-12 rounded bg-primary" />
            <div className="h-6 w-12 rounded bg-secondary" />
            <div className="h-6 w-12 rounded bg-destructive" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
