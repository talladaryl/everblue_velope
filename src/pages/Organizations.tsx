import { useState } from "react";
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
  AlertCircle,
  Building2,
  Loader2,
} from "lucide-react";
import { useOrganizations } from "@/hooks/useOrganizations";
import { OrganizationModal } from "@/components/OrganizationModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { Organization } from "@/api/services/organizationService";

export default function Organizations() {
  const {
    organizations,
    loading,
    error,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  } = useOrganizations();

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | undefined>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState<Organization | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Filtrer les organisations
  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gérer la création/modification
  const handleSaveOrganization = async (payload: { name: string }) => {
    try {
      setSavingId(selectedOrganization?.id || -1);
      if (selectedOrganization) {
        await updateOrganization(selectedOrganization.id, payload);
      } else {
        await createOrganization(payload);
      }
      setShowModal(false);
      setSelectedOrganization(undefined);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setSavingId(null);
    }
  };

  // Gérer la suppression
  const handleDeleteOrganization = async () => {
    if (!organizationToDelete) return;
    try {
      setDeletingId(organizationToDelete.id);
      await deleteOrganization(organizationToDelete.id);
      setShowDeleteConfirm(false);
      setOrganizationToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setDeletingId(null);
    }
  };

  // Ouvrir le modal de création
  const handleNewOrganization = () => {
    setSelectedOrganization(undefined);
    setShowModal(true);
  };

  // Ouvrir le modal d'édition
  const handleEditOrganization = (org: Organization) => {
    setSelectedOrganization(org);
    setShowModal(true);
  };

  // Ouvrir la confirmation de suppression
  const handleConfirmDelete = (org: Organization) => {
    setOrganizationToDelete(org);
    setShowDeleteConfirm(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              Organisations
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez vos organisations et leurs paramètres
            </p>
          </div>
          <Button
            onClick={handleNewOrganization}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle organisation
          </Button>
        </div>

        {/* Erreur globale */}
        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Barre de recherche */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une organisation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        {organizations.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total d'organisations</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{organizations.length}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des organisations */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredOrganizations.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm
                  ? "Aucune organisation ne correspond à votre recherche"
                  : "Aucune organisation pour le moment"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={handleNewOrganization}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Créer la première organisation
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrganizations.map((org) => (
              <Card
                key={org.id}
                className="hover:shadow-lg transition-shadow overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {org.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        ID: {org.id}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={savingId === org.id || deletingId === org.id}
                        >
                          {savingId === org.id || deletingId === org.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreVertical className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditOrganization(org)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleConfirmDelete(org)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Créée le:</span>
                      <span className="font-medium">{formatDate(org.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Propriétaire:</span>
                      <Badge variant="secondary">ID: {org.owner_id}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal */}
        <OrganizationModal
          open={showModal}
          onOpenChange={setShowModal}
          organization={selectedOrganization}
          onSave={handleSaveOrganization}
          loading={savingId === (selectedOrganization?.id || -1)}
        />

        {/* Confirmation de suppression */}
        <ConfirmDialog
          open={showDeleteConfirm}
          title="Supprimer l'organisation"
          description={`Êtes-vous sûr de vouloir supprimer "${organizationToDelete?.name}" ? Cette action est irréversible.`}
          onConfirm={handleDeleteOrganization}
          onCancel={() => setShowDeleteConfirm(false)}
          isLoading={deletingId === organizationToDelete?.id}
          confirmText="Supprimer"
          isDestructive
        />
      </div>
    </div>
  );
}
