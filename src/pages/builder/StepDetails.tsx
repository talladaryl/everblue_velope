import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Download, Plus } from "lucide-react";

export default function StepDetails({ ctx }: { ctx: any }) {
  const {
    guests,
    setGuests,
    validCount,
    handleCSV,
    addGuest,
    setStep,
    previewGuestId,
    setPreviewGuestId,
  } = ctx;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-enter">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des invités</CardTitle>
          <CardDescription>
            Importez vos contacts ou ajoutez-les manuellement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Liste des invités</h3>
              <p className="text-sm text-muted-foreground">
                {guests.length} invités —{" "}
                <Badge variant={validCount > 0 ? "default" : "destructive"}>
                  {validCount} valides
                </Badge>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center">
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && handleCSV(e.target.files[0])
                  }
                />
                <span className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md border hover:bg-accent transition-colors">
                  <Download className="h-4 w-4" />
                  Importer CSV
                </span>
              </label>
              <Button variant="outline" onClick={addGuest}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Lieu</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guests.map((g: any) => (
                  <TableRow key={g.id}>
                    <TableCell>
                      <Input
                        value={g.name}
                        onChange={(e) =>
                          setGuests((prev: any[]) =>
                            prev.map((p) =>
                              p.id === g.id ? { ...p, name: e.target.value } : p
                            )
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={g.email}
                        onChange={(e) =>
                          setGuests((prev: any[]) =>
                            prev.map((p) =>
                              p.id === g.id
                                ? {
                                    ...p,
                                    email: e.target.value,
                                    valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                      e.target.value
                                    ),
                                  }
                                : p
                            )
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={g.location || ""}
                        onChange={(e) =>
                          setGuests((prev: any[]) =>
                            prev.map((p) =>
                              p.id === g.id
                                ? { ...p, location: e.target.value }
                                : p
                            )
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={g.date || ""}
                        onChange={(e) =>
                          setGuests((prev: any[]) =>
                            prev.map((p) =>
                              p.id === g.id ? { ...p, date: e.target.value } : p
                            )
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={g.time || ""}
                        onChange={(e) =>
                          setGuests((prev: any[]) =>
                            prev.map((p) =>
                              p.id === g.id ? { ...p, time: e.target.value } : p
                            )
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant={g.valid ? "default" : "destructive"}>
                        {g.valid ? "Valide" : "Invalide"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(0)}>
              ← Retour
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={addGuest}>
                Ajouter invité
              </Button>
              <Button
                onClick={() => {
                  if (guests.length && !previewGuestId)
                    setPreviewGuestId(guests[0].id);
                  setStep(2);
                }}
                disabled={!guests.length || !validCount}
              >
                Continuer → (Prévisualisation)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
