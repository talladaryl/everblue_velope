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
} from "lucide-react";
import Papa from "papaparse";
import { toast } from "@/components/ui/sonner";

interface Guest {
  id: string;
  name: string;
  email: string;
  location?: string;
  date?: string;
  time?: string;
  valid: boolean;
  message?: string;
}

interface GuestManagerProps {
  guests: Guest[];
  onGuestsChange: (guests: Guest[]) => void;
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const GuestManager: React.FC<GuestManagerProps> = ({
  guests,
  onGuestsChange,
}) => {
  const [newGuest, setNewGuest] = useState<Partial<Guest>>({
    name: "",
    email: "",
    location: "",
    date: "",
    time: "",
  });

  const validGuests = guests.filter((g) => g.valid);
  const invalidGuests = guests.filter((g) => !g.valid);

  const addGuest = () => {
    if (!newGuest.name?.trim()) {
      toast.error("Veuillez entrer un nom");
      return;
    }

    if (!newGuest.email?.trim()) {
      toast.error("Veuillez entrer un email");
      return;
    }

    if (!isValidEmail(newGuest.email)) {
      toast.error("Email invalide");
      return;
    }

    const guest: Guest = {
      id: `guest-${Date.now()}`,
      name: newGuest.name,
      email: newGuest.email,
      location: newGuest.location || "",
      date: newGuest.date || "",
      time: newGuest.time || "",
      valid: true,
    };

    onGuestsChange([...guests, guest]);
    setNewGuest({
      name: "",
      email: "",
      location: "",
      date: "",
      time: "",
    });
    toast.success("Invité ajouté");
  };

  const removeGuest = (id: string) => {
    onGuestsChange(guests.filter((g) => g.id !== id));
    toast.success("Invité supprimé");
  };

  const updateGuest = (id: string, updates: Partial<Guest>) => {
    onGuestsChange(
      guests.map((g) => {
        if (g.id === id) {
          const updated = { ...g, ...updates };
          // Valider l'email si modifié
          if (updates.email) {
            updated.valid = isValidEmail(updates.email);
          }
          return updated;
        }
        return g;
      })
    );
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const newGuests: Guest[] = results.data
          .map((row: any) => ({
            id: `guest-${Date.now()}-${Math.random()}`,
            name: row.name || row.nom || "",
            email: row.email || row.mail || "",
            location: row.location || row.lieu || "",
            date: row.date || "",
            time: row.time || row.heure || "",
            valid: isValidEmail(row.email || row.mail || ""),
          }))
          .filter((g: Guest) => g.name && g.email);

        if (newGuests.length === 0) {
          toast.error("Aucun invité valide trouvé dans le fichier");
          return;
        }

        onGuestsChange([...guests, ...newGuests]);
        toast.success(`${newGuests.length} invité(s) importé(s)`);
      },
      error: () => {
        toast.error("Erreur lors de la lecture du fichier CSV");
      },
    });
  };

  const downloadTemplate = () => {
    const template = "name,email,location,date,time\nJean Dupont,jean@example.com,Paris,2025-06-15,14:00\n";
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
            <p className="text-3xl font-bold text-green-700">{validGuests.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <p className="text-sm text-red-600 font-medium">Invalides</p>
            <p className="text-3xl font-bold text-red-700">{invalidGuests.length}</p>
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
              <Label htmlFor="guest-name">Nom</Label>
              <Input
                id="guest-name"
                value={newGuest.name || ""}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, name: e.target.value })
                }
                placeholder="Nom"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="guest-email">Email</Label>
              <Input
                id="guest-email"
                type="email"
                value={newGuest.email || ""}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, email: e.target.value })
                }
                placeholder="jean@example.com"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="guest-location">Lieu (optionnel)</Label>
              <Input
                id="guest-location"
                value={newGuest.location || ""}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, location: e.target.value })
                }
                placeholder="Ville"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="guest-date">Date (optionnel)</Label>
              <Input
                id="guest-date"
                type="date"
                value={newGuest.date || ""}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, date: e.target.value })
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="guest-time">Heure (optionnel)</Label>
              <Input
                id="guest-time"
                type="time"
                value={newGuest.time || ""}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, time: e.target.value })
                }
                className="mt-2"
              />
            </div>
          </div>
          <Button onClick={addGuest} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter l'invité
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
                    <TableHead>Lieu</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell className="font-medium">{guest.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {guest.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {guest.location ? (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            {guest.location}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {guest.date ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {new Date(guest.date).toLocaleDateString("fr-FR")}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {guest.time ? (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            {guest.time}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {guest.valid ? (
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
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
            Aucun invité ajouté. Commencez par ajouter des invités ou importer un fichier CSV.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
