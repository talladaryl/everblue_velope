import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Wand2,
  AlertCircle,
  CheckCircle,
  Download,
  Copy,
  Trash2,
} from "lucide-react";
import { useAIImageGenerator } from "@/hooks/useAIImageGenerator";

interface AIImageGeneratorProps {
  onImageSelected?: (imageUrl: string) => void;
  onClose?: () => void;
}

export function AIImageGenerator({ onImageSelected, onClose }: AIImageGeneratorProps) {
  const { generating, error, generatedImage, imageHistory, generateImage, clearError, resetImage } =
    useAIImageGenerator();

  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");

  const handleGenerate = async () => {
    try {
      await generateImage(prompt, style);
    } catch (error) {
      console.error("Erreur génération:", error);
    }
  };

  const handleUseImage = (imageUrl: string) => {
    if (onImageSelected) {
      onImageSelected(imageUrl);
      if (onClose) {
        onClose();
      }
    }
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `generated-image-${Date.now()}.png`;
    link.click();
  };

  const handleCopyUrl = (imageUrl: string) => {
    navigator.clipboard.writeText(imageUrl);
    alert("URL copiée dans le presse-papiers!");
  };

  return (
    <div className="space-y-6">
      {/* Formulaire de génération */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-purple-600" />
            Générateur d'images IA
          </CardTitle>
          <CardDescription>
            Décrivez l'image que vous souhaitez générer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="prompt">Description de l'image</Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Un coucher de soleil sur la plage avec des palmiers..."
              className="mt-2"
              disabled={generating}
            />
          </div>

          <div>
            <Label htmlFor="style">Style</Label>
            <Select value={style} onValueChange={setStyle} disabled={generating}>
              <SelectTrigger id="style" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realistic">Réaliste</SelectItem>
                <SelectItem value="artistic">Artistique</SelectItem>
                <SelectItem value="cartoon">Dessin animé</SelectItem>
                <SelectItem value="watercolor">Aquarelle</SelectItem>
                <SelectItem value="oil-painting">Peinture à l'huile</SelectItem>
                <SelectItem value="digital-art">Art numérique</SelectItem>
                <SelectItem value="photography">Photographie</SelectItem>
                <SelectItem value="3d-render">Rendu 3D</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Générer l'image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Image générée */}
      {generatedImage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Image générée
            </CardTitle>
            <CardDescription>{generatedImage.prompt}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={generatedImage.url}
                alt={generatedImage.prompt}
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => handleUseImage(generatedImage.url)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Utiliser cette image
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDownload(generatedImage.url)}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button
                variant="outline"
                onClick={() => handleCopyUrl(generatedImage.url)}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copier URL
              </Button>
              <Button
                variant="outline"
                onClick={resetImage}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Effacer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historique des images */}
      {imageHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des images</CardTitle>
            <CardDescription>
              Vos {imageHistory.length} dernières images générées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imageHistory.map((image) => (
                <div
                  key={image.id}
                  className="group relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                >
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-32 object-cover group-hover:opacity-75 transition"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUseImage(image.url)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Utiliser
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(image.url)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 truncate">
                    {image.prompt}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
