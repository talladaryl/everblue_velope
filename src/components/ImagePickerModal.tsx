import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Upload, Image as ImageIcon, Palette } from "lucide-react";
import { PAPER_THEMES } from "@/constants/paperThemes";

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (file: File) => void;
  onSelectTheme: (theme: any) => void;
  onSetAsBackground: (isBackground: boolean) => void;
}

export default function ImagePickerModal({
  isOpen,
  onClose,
  onSelectImage,
  onSelectTheme,
  onSetAsBackground,
}: ImagePickerModalProps) {
  const [imageType, setImageType] = useState<"upload" | "background">("upload");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  if (!isOpen) return null;

  const categories = [
    "all",
    "mariage",
    "anniversaire",
    "bapteme",
    "entreprise",
    "autre",
  ];
  const filteredThemes =
    selectedCategory === "all"
      ? PAPER_THEMES
      : PAPER_THEMES.filter((theme) => theme.category === selectedCategory);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectImage(file);
      onSetAsBackground(imageType === "background");
      onClose();
    }
  };

  const handleThemeSelect = (theme: any) => {
    onSelectTheme(theme);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold">Ajouter une image</h2>
              <p className="text-muted-foreground">
                Choisissez une image ou un fond de papier
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Uploader une image
              </TabsTrigger>
              <TabsTrigger value="themes" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Fonds prédéfinis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Type d'image</CardTitle>
                  <CardDescription>
                    Choisissez comment utiliser cette image
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={imageType}
                    onValueChange={(value: "upload" | "background") =>
                      setImageType(value)
                    }
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upload" id="upload" />
                      <Label htmlFor="upload" className="cursor-pointer">
                        Image normale (élément positionnable)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="background" id="background" />
                      <Label htmlFor="background" className="cursor-pointer">
                        Fond de papier (arrière-plan)
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Uploader une image</CardTitle>
                  <CardDescription>
                    Formats supportés: JPG, PNG, GIF, WebP
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <div className="space-y-2">
                        <p className="font-semibold">Cliquez pour uploader</p>
                        <p className="text-sm text-muted-foreground">
                          ou glissez-déposez votre image ici
                        </p>
                      </div>
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="themes" className="space-y-4">
              {/* Filtres par catégorie */}
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === "all" && "Tous"}
                    {category === "mariage" && "💍 Mariage"}
                    {category === "anniversaire" && "🎉 Anniversaire"}
                    {category === "bapteme" && "👶 Baptême"}
                    {category === "entreprise" && "💼 Entreprise"}
                    {category === "autre" && "📄 Autre"}
                  </Button>
                ))}
              </div>

              {/* Grille des thèmes */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredThemes.map((theme) => (
                  <Card
                    key={theme.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleThemeSelect(theme)}
                  >
                    <CardContent className="p-0">
                      <div
                        className="h-24 rounded-t-lg flex items-center justify-center text-2xl"
                        style={{
                          background:
                            theme.type === "texture"
                              ? `#f8fafc ${theme.value}`
                              : theme.value,
                        }}
                      >
                        {theme.thumbnail}
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-sm">{theme.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {theme.category}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
