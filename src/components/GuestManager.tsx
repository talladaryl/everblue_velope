import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Trash2,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Loader2,
} from "lucide-react";
import Papa from "papaparse";
import { toast } from "@/components/ui/sonner";
import type { Guest } from "@/api/services/guestService";

interface GuestManagerProps {
  guests: any[];
  onGuestAdd: (guestData: any) => Promise<void>;
  onGuestUpdate: (guestId: any, guestData: any) => Promise<void>;
  onGuestDelete: (guestId: any) => Promise<void>;
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  return phone && phone.trim().length > 0;
};

export const GuestManager: React.FC<GuestManagerProps> = ({
  guests,
  onGuestAdd,
  onGuestUpdate,
  onGuestDelete,
}) => {
  const [newGuest, setNewGuest] = useState({
    name: "",
    email: "",
    phone: "",
    plus_one_allowed: false,
  });
  const [loading, setLoading] = useState(false);

  const validGuests = guests.filter((g) => g.email || g.phone);
  const invalidGuests = guests.filter((g) => !g.email && !g.phone);

  const addGuest = async () => {
    if (!newGuest.name?.trim()) {
      toast.error("Veuillez entrer un nom");
      return;
    }

    if (!newGuest.email?.trim() && !newGuest.phone?.trim()) {
      toast.error("Veuillez entrer un email ou un téléphone");
      return;
    }

    if (newGuest.email && !isValidEmail(newGuest.email)) {
      toast.error("Email invalide");
      return;
    }

    try {
      setLoading(true);
      await onGuestAdd({
        name: newGuest.name,
        email: newGuest.email || undefined,
        phone: newGuest.phone || undefined,
        plus_one_allowed: newGuest.plus_one_allowed,
      });
      setNewGuest({
        name: "",
        email: "",
        phone: "",
        plus_one_allowed: false,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeGuest = async (id: any) => {
    try {
      setLoading(true);
      await onGuestDelete(id);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCSVUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: any) => {
        const newGuests = results.data
          .map((row: any) => ({
            name: (row.name || row.nom || "").trim(),
            email: (row.email || row.mail || "").trim(),
            phone: (row.phone || row.telephone || "").trim(),
            plus_one_allowed:
              row.plus_one_allowed === "true" || row.plus_one_allowed === "1",
          }))
          .filter((g: any) => g.name.length > 0 && (g.email.length > 0 || g.phone.length > 0));

        if (newGuests.length === 0) {
          toast.error("Aucun invité valide trouvé dans le fichier");
          return;
        }

        try {
          setLoading(true);
          for (const guest of newGuests) {
            await onGuestAdd(guest);
          }
          toast.success(`${newGuests.length} invité(s) importé(s)`);
        } catch (error) {
          console.error("Erreur lors de l'import:", error);
        } finally {
          setLoading(false);
        }
      },
      error: () => {
        toast.error("Erreur lors de la lecture du fichier CSV");
      },
    });
  };

  const downloadTemplate = () => {
    const template =
      "name,email,phone,plus_one_allowed\nDaryl Arsel,daryl@gmail.com,658940985,false\nJean Dupont,jean@gmail.com,658940986,true\n";
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(template)
    );
    element.setAttribute("download", "guests_template.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Modèle téléchargé");
  };

  return (
    <div className="space-y-6">
      {/* Résumé */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-600 font-medium">Total</p>
            <p className="text-3xl font-bold text-blue-700">{guests.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <p className="text-sm text-green-600 font-medium">Valides</p>
            <p className="text-3xl font-bold text-green-700">
              {validGuests.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <p className="text-sm text-red-600 font-medium">Invalides</p>
            <p className="text-3xl font-bold text-red-700">
              {invalidGuests.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ajouter un invité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ajouter un invité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guest-name">Nom *</Label>
              <Input
                id="guest-name"
                value={newGuest.name}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, name: e.target.value })
                }
                placeholder="Jean Dupont"
                className="mt-2"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="guest-email">Email</Label>
              <Input
                id="guest-email"
                type="email"
                value={newGuest.email}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, email: e.target.value })
                }
                placeholder="jean@example.com"
                className="mt-2"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="guest-phone">Téléphone</Label>
              <Input
                id="guest-phone"
                value={newGuest.phone}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, phone: e.target.value })
                }
                placeholder="+1XXXXXXXXXXX"
                className="mt-2"
                disabled={loading}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newGuest.plus_one_allowed}
                  onChange={(e) =>
                    setNewGuest({
                      ...newGuest,
                      plus_one_allowed: e.target.checked,
                    })
                  }
                  disabled={loading}
                  className="w-4 h-4"
                />
                <span className="text-sm">Autoriser +1</span>
              </label>
            </div>
          </div>
          <Button onClick={addGuest} className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter l'invité
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Import/Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import/Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
              <Upload className="h-4 w-4" />
              <span className="text-sm font-medium">Importer CSV</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
            </label>
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Télécharger modèle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des invités */}
      {guests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Liste des invités ({guests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>+1 autorisé</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guests.map((guest) => {
                    const isValid = guest.email || guest.phone;
                    const displayName = guest.full_name || guest.name || "Sans nom";
                    return (
                      <TableRow key={guest.id}>
                        <TableCell className="font-medium">
                          {displayName}
                        </TableCell>
                        <TableCell>
                          {guest.email ? (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              {guest.email}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {guest.phone ? (
                            <div className="flex items-center gap-2">
                              {guest.phone}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              guest.plus_one_allowed ? "default" : "secondary"
                            }
                          >
                            {guest.plus_one_allowed ? "Oui" : "Non"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {isValid ? (
                            <Badge className="bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                              <CheckCircle className="h-3 w-3" />
                              Valide
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                              <AlertCircle className="h-3 w-3" />
                              Invalide
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeGuest(guest.id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message si aucun invité */}
      {guests.length === 0 && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Aucun invité ajouté. Commencez par ajouter des invités ou importer
            un fichier CSV.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
