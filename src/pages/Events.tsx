import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
// Force recompile
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  MapPin,
  Loader2,
} from "lucide-react";
import { EventModal } from "@/components/EventModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useEvents } from "@/hooks/useEvents";
import type { Event, CreateEventPayload, EventStatus } from "@/api/services/eventService";
import { toast } from "@/components/ui/sonner";

export default function Events() {
  const { events, loading, error, createEvent, updateEvent, deleteEvent, updateEventStatus } =
    useEvents();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | EventStatus>("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  // Filtrer les événements
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || event.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Trier par date
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (!a.event_date) return 1;
    if (!b.event_date) return -1;
    return new Date(b.event_date).getTime() - new Date(a.event_date).getTime();
  });

  // Gérer la création/modification
  const handleSaveEvent = async (payload: CreateEventPayload) => {
    try {
      setSavingId(selectedEvent?.id || -1);
      if (selectedEvent) {
        await updateEvent(selectedEvent.id, payload);
      } else {
        await createEvent(payload);
      }
      setShowModal(false);
      setSelectedEvent(undefined);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setSavingId(null);
    }
  };

  // Gérer la suppression
  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    try {
      setSavingId(eventToDelete.id);
      await deleteEvent(eventToDelete.id);
      setShowDeleteConfirm(false);
      setEventToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setSavingId(null);
    }
  };

  // Gérer le changement de statut
  const handleStatusChange = async (event: Event, newStatus: EventStatus) => {
    try {
      setSavingId(event.id);
      await updateEventStatus(event.id, newStatus);
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
    } finally {
      setSavingId(null);
    }
  };

  // Ouvrir le modal de création
  const handleNewEvent = () => {
    setSelectedEvent(undefined);
    setShowModal(true);
  };

  // Ouvrir le modal d'édition
  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  // Ouvrir la confirmation de suppression
  const handleConfirmDelete = (event: Event) => {
    setEventToDelete(event);
    setShowDeleteConfirm(true);
  };

  const getStatusIcon = (status: EventStatus) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "draft":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "archived":
        return <Archive className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Brouillon</Badge>;
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800">Archivé</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non défini";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Événements</h1>
            <p className="text-gray-600 mt-1">
              Gérez vos événements et envoyez des invitations
            </p>
          </div>
          <Button
            onClick={handleNewEvent}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvel événement
          </Button>
        </div>

        {/* Erreur globale */}
        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Barre de recherche et filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un événement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {(["all", "active", "draft", "archived"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    onClick={() => setFilterStatus(status)}
                    size="sm"
                  >
                    {status === "all"
                      ? "Tous"
                      : status === "active"
                      ? "Actifs"
                      : status === "draft"
                      ? "Brouillons"
                      : "Archivés"}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des événements */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : sortedEvents.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm || filterStatus !== "all"
                  ? "Aucun événement ne correspond à votre recherche"
                  : "Aucun événement pour le moment"}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Button
                  onClick={handleNewEvent}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Créer le premier événement
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sortedEvents.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-lg transition-shadow overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Contenu principal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="pt-1">{getStatusIcon(event.status)}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {event.title}
                          </h3>
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Détails */}
                      <div className="space-y-2 mt-4">
                        {event.event_date && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            {formatDate(event.event_date)}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 text-red-600" />
                            {event.location}
                          </div>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex gap-2 mt-4">
                        {getStatusBadge(event.status)}
                        {event.template_id && (
                          <Badge variant="secondary">Template assigné</Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={savingId === event.id}
                          >
                            {savingId === event.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreVertical className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {event.status !== "active" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(event, "active")}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activer
                            </DropdownMenuItem>
                          )}

                          {event.status !== "draft" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(event, "draft")}
                            >
                              <Clock className="h-4 w-4 mr-2" />
                              Mettre en brouillon
                            </DropdownMenuItem>
                          )}

                          {event.status !== "archived" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(event, "archived")}
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Archiver
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => handleConfirmDelete(event)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Statistiques */}
        {events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Événements actifs</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {events.filter((e) => e.status === "active").length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">En brouillon</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {events.filter((e) => e.status === "draft").length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Archivés</p>
                  <p className="text-3xl font-bold text-gray-600 mt-2">
                    {events.filter((e) => e.status === "archived").length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Modal */}
      <EventModal
        open={showModal}
        onOpenChange={setShowModal}
        event={selectedEvent}
        onSave={handleSaveEvent}
        loading={savingId === (selectedEvent?.id || -1)}
      />

      {/* Confirmation de suppression */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Supprimer l'événement"
        description={`Êtes-vous sûr de vouloir supprimer "${eventToDelete?.title}" ? Cette action est irréversible.`}
        onConfirm={handleDeleteEvent}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={savingId === eventToDelete?.id}
        confirmText="Supprimer"
        isDestructive
      />
    </div>
  );
}
