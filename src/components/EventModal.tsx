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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useTemplates } from "@/hooks/useTemplates";
import type { Event, CreateEventPayload } from "@/api/services/eventService";

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event;
  onSave: (payload: CreateEventPayload) => Promise<void>;
  loading?: boolean;
}

export function EventModal({
  open,
  onOpenChange,
  event,
  onSave,
  loading = false,
}: EventModalProps) {
  const { organizations } = useOrganizations();
  const { templates } = useTemplates();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [organizationId, setOrganizationId] = useState<string>("");
  const [templateId, setTemplateId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || "");
      setEventDate(event.event_date ? event.event_date.slice(0, 16) : "");
      setLocation(event.location || "");
      setOrganizationId(event.organization_id?.toString() || "");
      setTemplateId(event.template_id?.toString() || "");
    } else {
      setTitle("");
      setDescription("");
      setEventDate("");
      setLocation("");
      setOrganizationId("");
      setTemplateId("");
    }
    setError(null);
  }, [event, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Le titre est requis");
      return;
    }

    if (!templateId) {
      setError("Veuillez sélectionner un template");
      return;
    }

    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        event_date: eventDate || undefined,
        location: location.trim() || undefined,
        organization_id: organizationId ? parseInt(organizationId) : undefined,
        template_id: templateId ? parseInt(templateId) : undefined,
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
            {event ? "Modifier l'événement" : "Créer un nouvel événement"}
          </DialogTitle>
          <DialogDescription>
            {event
              ? "Mettez à jour les détails de votre événement"
              : "Remplissez les informations de votre événement"}
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
            <Label htmlFor="title">Titre de l'événement *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Mariage de Jean et Marie"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre événement..."
              className="mt-2"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="eventDate">Date et heure</Label>
            <Input
              id="eventDate"
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="location">Lieu</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Salle des fêtes, Paris"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="organization">Organisation</Label>
            <Select value={organizationId} onValueChange={setOrganizationId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Sélectionner une organisation" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id.toString()}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="template">Template *</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Sélectionner un template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id.toString()}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
