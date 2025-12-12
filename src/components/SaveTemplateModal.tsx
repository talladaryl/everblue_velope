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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SaveTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: {
    title: string;
    model_preview_id?: number | null;
    data: any;
    thumbnail?: string | null;
  }) => Promise<void>;
  loading?: boolean;
  data?: any;
  modelPreviewId?: number | null;
}

export function SaveTemplateModal({
  open,
  onOpenChange,
  onSave,
  loading = false,
  data,
  modelPreviewId,
}: SaveTemplateModalProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError(t("saveTemplate.titleRequired"));
      return;
    }

    try {
      await onSave({
        title: title.trim(),
        model_preview_id: modelPreviewId || null,
        data: data || {},
        thumbnail: null, // TODO: Générer une miniature
      });
      setTitle("");
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || t("common.error"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("saveTemplate.title")}</DialogTitle>
          <DialogDescription>
            {t("saveTemplate.description")}
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
            <Label htmlFor="template-title">{t("saveTemplate.nameLabel")}</Label>
            <Input
              id="template-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("saveTemplate.namePlaceholder")}
              className="mt-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("saveTemplate.saving")}
                </>
              ) : (
                t("saveTemplate.save")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
