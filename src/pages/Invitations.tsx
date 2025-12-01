import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle,
  Users,
  Download,
} from "lucide-react";
import { useGuests } from "@/hooks/useGuests";
import { useMailingStats } from "@/hooks/useMailingStats";
import { MailingStatsCard } from "@/components/MailingStatsCard";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "@/components/ui/sonner";

export default function Invitations() {
  const { guests, loading, error, fetchGuests, deleteGuest } = useGuests();
  const {
    stats,
    loading: statsLoading,
    error: statsError,
    fetchEventStats,
  } = useMailingStats();

  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"guests" | "stats">("guests");

  // Charger les invités au montage
  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  // Charger les statistiques
  useEffect(() => {
    if (activeTab === "stats") {
      fetchEventStats();
    }
  }, [activeTab, fetchEventStats]);

  // Filtrer les invités
  const filteredGuests = guests.filter(
    (guest) =>
      guest.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone?.includes(searchTerm)
  );

  // Gérer la suppression
  const handleDeleteGuest = async () => {
    if (!guestToDelete) return;
    try {
      setDeletingId(guestToDelete.id);
      await deleteGuest(guestToDelete.id);
      setShowDeleteConfirm(false);
      setGuestToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleConfirmDelete = (guest: any) => {
    setGuestToDelete(guest);
    setShowDeleteConfirm(true);
  };

  const getStatusBadge = (guest: any) => {
    if (guest.valid) {
      return <Badge className="bg-green-100 text-green-800">Valide</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800">Invalide</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              Gestion des invitations
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez vos invités et consultez les statistiques d'envoi
            </p>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("guests")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "guests"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Invités ({guests.length})
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "stats"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Statistiques
          </button>
        </div>

        {/* Onglet Invités */}
        {activeTab === "guests" && (
          <div className="space-y-6">
            {/* Erreur globale */}
            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Barre de recherche */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom, email ou téléphone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Statistiques rapides */}
            {guests.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total d'invités</p>
                      <p className="text-3xl font-bold text-blue-600 mt-2">
                        {guests.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Valides</p>
                      <p className="text-3xl font-bold text-green-600 mt-2">
                        {guests.filter((g) => g.valid).length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Invalides</p>
                      <p className="text-3xl font-bold text-red-600 mt-2">
                        {guests.filter((g) => !g.valid).length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Liste des invités */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredGuests.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {searchTerm
                      ? "Aucun invité ne correspond à votre recherche"
                      : "Aucun invité pour le moment"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredGuests.map((guest) => (
                  <Card
                    key={guest.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Infos principales */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {guest.full_name}
                            </h3>
                            {getStatusBadge(guest)}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            {guest.email && <p>📧 {guest.email}</p>}
                            {guest.phone && <p>📱 {guest.phone}</p>}
                            {guest.plus_one_allowed && (
                              <p className="text-purple-600">✓ +1 autorisé</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Ajouté le {formatDate(guest.created_at)}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={deletingId === guest.id}
                              >
                                {deletingId === guest.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MoreVertical className="h-4 w-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  toast.info("Fonctionnalité à venir")
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleConfirmDelete(guest)}
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
          </div>
        )}

        {/* Onglet Statistiques */}
        {activeTab === "stats" && (
          <MailingStatsCard
            stats={stats}
            loading={statsLoading}
            error={statsError}
          />
        )}

        {/* Confirmation de suppression */}
        <ConfirmDialog
          open={showDeleteConfirm}
          title="Supprimer l'invité"
          description={`Êtes-vous sûr de vouloir supprimer "${guestToDelete?.full_name}" ? Cette action est irréversible.`}
          onConfirm={handleDeleteGuest}
          onCancel={() => setShowDeleteConfirm(false)}
          isLoading={deletingId === guestToDelete?.id}
          confirmText="Supprimer"
          isDestructive
        />
      </div>
    </div>
  );
}
