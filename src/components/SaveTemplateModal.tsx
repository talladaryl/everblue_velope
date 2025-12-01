import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

interface SaveTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: {
    name: string;
    category: string;
    description?: string;
    structure: any;
  }) => Promise<void>;
  loading?: boolean;
  structure?: any;
}

const CATEGORIES = [
  { value: "wedding", label: "Mariage" },
  { value: "birthday", label: "Anniversaire" },
  { value: "corporate", label: "Événement professionnel" },
  { value: "party", label: "Fête" },
  { value: "other", label: "Autre" },
];

export function SaveTemplateModal({
  open,
  onOpenChange,
  onSave,
  loading = false,
  structure,
}: SaveTemplateModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("other");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Le nom du template est requis");
      return;
    }

    try {
      await onSave({
        name: name.trim(),
        category,
        description: description.trim() || undefined,
        structure: structure || {},
      });
      setName("");
      setCategory("other");
      setDescription("");
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sauvegarder le template</DialogTitle>
          <DialogDescription>
            Conservez ce design pour une utilisation future
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="template-name">Nom du template *</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Invitation Mariage 2025"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="template-category">Catégorie</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="template-category" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="template-description">Description (optionnel)</Label>
            <Textarea
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez ce template..."
              className="mt-2"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                "Sauvegarder"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
