import { useState, useEffect } from "react";
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
import type { Organization, CreateOrganizationPayload } from "@/api/services/organizationService";

interface OrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: Organization;
  onSave: (payload: CreateOrganizationPayload) => Promise<void>;
  loading?: boolean;
}

export function OrganizationModal({
  open,
  onOpenChange,
  organization,
  onSave,
  loading = false,
}: OrganizationModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (organization) {
      setName(organization.name);
    } else {
      setName("");
    }
    setError(null);
  }, [organization, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Le nom de l'organisation est requis");
      return;
    }

    try {
      await onSave({
        name: name.trim(),
      });
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {organization ? "Modifier l'organisation" : "Créer une nouvelle organisation"}
          </DialogTitle>
          <DialogDescription>
            {organization
              ? "Mettez à jour les détails de votre organisation"
              : "Remplissez les informations de votre organisation"}
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
            <Label htmlFor="name">Nom de l'organisation *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Acme Corporation"
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
