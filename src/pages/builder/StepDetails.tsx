import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  Users,
  MessageCircle,
  Mail,
  Edit2,
  Trash2,
  Check,
  X,
  Upload,
  Download,
  Filter,
  Search,
  Globe,
  FileSpreadsheet,
  ShieldAlert,
} from "lucide-react";
import { nanoid } from "nanoid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

// Liste des indicatifs téléphoniques par pays
const COUNTRY_CODES = [
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+237", country: "Cameroon", flag: "🇨🇲" },
  { code: "+225", country: "Ivory Coast", flag: "🇨🇮" },
  { code: "+229", country: "Benin", flag: "🇧🇯" },
  { code: "+226", country: "Burkina Faso", flag: "🇧🇫" },
  { code: "+242", country: "Congo", flag: "🇨🇬" },
  { code: "+243", country: "DR Congo", flag: "🇨🇩" },
  { code: "+221", country: "Senegal", flag: "🇸🇳" },
  { code: "+228", country: "Togo", flag: "🇹🇬" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
];

export default function StepDetails({ ctx }: { ctx: any }) {
  const { setStep, previewGuestId, setPreviewGuestId, guests, setGuests } = ctx;
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterChannel, setFilterChannel] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [importProgress, setImportProgress] = useState(0);
  const [importing, setImporting] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newGuest, setNewGuest] = useState({
    channel: "whatsapp",
    name: "",
    phone: "",
    email: "",
    countryCode: "+33",
  });

  // Validation avancée des emails
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation avancée des numéros de téléphone
  const validatePhone = (phone: string, countryCode: string) => {
    const phoneWithoutCode = phone.replace(countryCode, "").trim();
    const phoneRegex = /^[\d\s\-\(\)\.]+$/;
    return phoneRegex.test(phoneWithoutCode) && phoneWithoutCode.length >= 8;
  };

  // Filtrer les invités selon les critères
  const filteredGuests =
    guests?.filter((guest: any) => {
      const matchesChannel =
        filterChannel === "all" || guest.channel === filterChannel;
      const matchesSearch =
        searchTerm === "" ||
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.phone.includes(searchTerm);

      return matchesChannel && matchesSearch;
    }) || [];

  // Calculer les invités valides
  const validCount =
    guests && guests.length > 0
      ? guests.filter((g: any) => {
          if (g.channel === "email") {
            return g.email && validateEmail(g.email);
          } else if (g.channel === "whatsapp") {
            return g.phone && validatePhone(g.phone, g.countryCode || "+33");
          }
          return false;
        }).length
      : 0;

  // Statistiques
  const stats = {
    total: guests?.length || 0,
    whatsapp: guests?.filter((g: any) => g.channel === "whatsapp").length || 0,
    email: guests?.filter((g: any) => g.channel === "email").length || 0,
    invalid: (guests?.length || 0) - validCount,
  };

  // Réinitialiser le formulaire d'ajout
  const resetNewGuest = () => {
    setNewGuest({
      channel: "whatsapp",
      name: "",
      phone: "",
      email: "",
      countryCode: "+33",
    });
  };

  // Ajouter un nouvel invité
  const handleAddGuest = () => {
    if (!newGuest.name.trim()) {
      alert(t("guests.form.validation.nameRequired"));
      return;
    }

    let isValid = false;
    let errorMessage = "";

    if (newGuest.channel === "whatsapp") {
      const phoneNumber = newGuest.phone.startsWith("+")
        ? newGuest.phone
        : `${newGuest.countryCode} ${newGuest.phone}`;

      isValid = validatePhone(phoneNumber, newGuest.countryCode);
      if (!isValid) {
        errorMessage = t("guests.form.validation.invalidPhone");
      }
    } else {
      isValid = validateEmail(newGuest.email);
      if (!isValid) {
        errorMessage = t("guests.form.validation.invalidEmail");
      }
    }

    if (!isValid) {
      alert(errorMessage);
      return;
    }

    const guestToAdd = {
      id: nanoid(),
      name: newGuest.name.trim(),
      full_name: newGuest.name.trim(),
      email: newGuest.channel === "email" ? newGuest.email.trim() : "",
      phone:
        newGuest.channel === "whatsapp"
          ? newGuest.phone.startsWith("+")
            ? newGuest.phone
            : `${newGuest.countryCode} ${newGuest.phone}`
          : "",
      countryCode: newGuest.channel === "whatsapp" ? newGuest.countryCode : "",
      channel: newGuest.channel,
      valid: isValid,
      plus_one_allowed: false,
      addedAt: new Date().toISOString(),
    };

    setGuests([...(guests || []), guestToAdd]);
    resetNewGuest();
  };

  // Gérer l'import CSV
  const handleCSVImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportProgress(0);

    try {
      const text = await file.text();
      const lines = text.split("\n");
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

      const importedGuests = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(",").map((v) => v.trim());
        const guestData: any = {};

        headers.forEach((header, index) => {
          guestData[header] = values[index] || "";
        });

        // Déterminer le canal
        let channel = "email";
        if (guestData.phone || guestData.tel || guestData.telephone) {
          channel = "whatsapp";
        }

        const importedGuest = {
          id: nanoid(),
          name: guestData.name || guestData.nom || guestData.fullname || "",
          full_name:
            guestData.name || guestData.nom || guestData.fullname || "",
          email: guestData.email || "",
          phone: guestData.phone || guestData.tel || guestData.telephone || "",
          channel,
          valid: false, // Sera validé après
          plus_one_allowed: false,
          imported: true,
          addedAt: new Date().toISOString(),
        };

        importedGuests.push(importedGuest);
        setImportProgress(Math.round((i / lines.length) * 100));
      }

      // Valider et ajouter les invités
      const validatedGuests = importedGuests.map((guest) => ({
        ...guest,
        valid:
          guest.channel === "email"
            ? validateEmail(guest.email)
            : validatePhone(guest.phone, guest.countryCode || "+33"),
      }));

      setGuests([...(guests || []), ...validatedGuests]);
      alert(`${importedGuests.length} ${t("guests.import.importSuccess")}`);
    } catch (error) {
      console.error("Erreur lors de l'import CSV:", error);
      alert(t("guests.import.importError"));
    } finally {
      setImporting(false);
      setImportProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Exporter en CSV
  const handleExportCSV = () => {
    if (!guests || guests.length === 0) {
      alert(t("guests.import.noGuestsToExport"));
      return;
    }

    const headers = ["Nom", "Canal", "Email", "Téléphone", "Statut"];
    const csvContent = [
      headers.join(","),
      ...guests.map((guest: any) =>
        [
          guest.name,
          guest.channel,
          guest.email,
          guest.phone,
          guest.valid ? "Valide" : "Invalide",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invites_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Simuler l'import depuis Google/Apple
  const handleServiceImport = (service: string) => {
    setShowImportDialog(false);
    alert(`${t("guests.import.serviceWillBeImplemented")} ${service}`);
    // Ici vous intégrerez l'API OAuth pour Google/Apple Contacts
  };

  // Commencer l'édition d'un invité
  const startEditing = (guest: any) => {
    setEditingId(guest.id);
  };

  // Sauvegarder l'édition
  const saveEdit = (guestId: string, updatedData: any) => {
    // Valider les données avant sauvegarde
    let isValid = false;

    if (updatedData.channel === "email") {
      isValid = validateEmail(updatedData.email || "");
    } else {
      isValid = validatePhone(
        updatedData.phone || "",
        updatedData.countryCode || "+33"
      );
    }

    setGuests(
      (guests || []).map((g: any) =>
        g.id === guestId
          ? {
              ...g,
              ...updatedData,
              full_name: updatedData.name,
              valid: isValid,
            }
          : g
      )
    );
    setEditingId(null);
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Supprimer un invité
  const handleGuestDelete = (guestId: string) => {
    if (confirm(t("guests.form.confirmDelete"))) {
      setGuests((guests || []).filter((g: any) => g.id !== guestId));
    }
  };

  // Gestionnaire pour continuer
  const handleContinue = () => {
    if (guests && guests.length > 0 && !previewGuestId) {
      setPreviewGuestId(guests[0].id);
    }
    setStep(2);
  };

  // Rendu d'une cellule éditée
  const renderEditableCell = (guest: any, field: string, value: any) => {
    if (editingId !== guest.id) {
      return <span>{value || "-"}</span>;
    }

    switch (field) {
      case "channel":
        return (
          <RadioGroup
            value={guest.channel}
            onValueChange={(value) =>
              saveEdit(guest.id, { ...guest, channel: value })
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="whatsapp" id={`${guest.id}-whatsapp`} />
              <Label
                htmlFor={`${guest.id}-whatsapp`}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                {t("guests.table.channels.whatsapp")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id={`${guest.id}-email`} />
              <Label
                htmlFor={`${guest.id}-email`}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                {t("guests.table.channels.email")}
              </Label>
            </div>
          </RadioGroup>
        );

      case "name":
        return (
          <Input
            value={guest.name}
            onChange={(e) =>
              saveEdit(guest.id, { ...guest, name: e.target.value })
            }
            className="w-full"
            autoFocus
          />
        );

      case "phone":
        if (guest.channel !== "whatsapp")
          return <span className="text-muted-foreground">-</span>;

        return (
          <div className="flex gap-2">
            <Select
              value={guest.countryCode || "+33"}
              onValueChange={(value) =>
                saveEdit(guest.id, { ...guest, countryCode: value })
              }
            >
              <SelectTrigger className="w-24">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRY_CODES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.flag} {country.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={guest.phone.replace(guest.countryCode || "+33", "").trim()}
              onChange={(e) => {
                const fullPhone = `${guest.countryCode || "+33"} ${
                  e.target.value
                }`;
                saveEdit(guest.id, { ...guest, phone: fullPhone });
              }}
              className="flex-1"
              placeholder={t("guests.table.placeholders.phone")}
            />
          </div>
        );

      case "email":
        if (guest.channel !== "email")
          return <span className="text-muted-foreground">-</span>;

        return (
          <Input
            value={guest.email}
            onChange={(e) =>
              saveEdit(guest.id, { ...guest, email: e.target.value })
            }
            className="w-full"
            type="email"
            placeholder={t("guests.table.placeholders.email")}
          />
        );

      default:
        return <span>{value || "-"}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-enter">
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            {t("guests.title")}
          </h2>
          <p className="text-muted-foreground mt-2">
            {t("guests.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{t("guests.stats.total")}</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.total}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <MessageCircle className="h-3 w-3" /> {t("guests.stats.whatsapp")}
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.whatsapp}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Mail className="h-3 w-3" /> {t("guests.stats.email")}
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.email}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{t("guests.stats.valid")}</p>
              <p
                className={`text-2xl font-bold ${
                  validCount > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {validCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes */}
      {(!guests || guests.length === 0) && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            {t("guests.alerts.noGuests")}
          </AlertDescription>
        </Alert>
      )}

      {guests && guests.length > 0 && validCount === 0 && (
        <Alert className="bg-red-50 border-red-200">
          <ShieldAlert className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {t("guests.alerts.noValidGuests")}
          </AlertDescription>
        </Alert>
      )}

      {validCount > 0 && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {validCount} {t("guests.alerts.validGuests")}
          </AlertDescription>
        </Alert>
      )}

      {/* Barre d'outils */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t("guests.search.placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterChannel} onValueChange={setFilterChannel}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("guests.search.filterAll")}</SelectItem>
                  <SelectItem value="whatsapp">{t("guests.search.filterWhatsapp")}</SelectItem>
                  <SelectItem value="email">{t("guests.search.filterEmail")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              {/* Import Dialog */}
              <Dialog
                open={showImportDialog}
                onOpenChange={setShowImportDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    {t("guests.import.title")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t("guests.import.title")}</DialogTitle>
                  </DialogHeader>

                  <Tabs defaultValue="csv" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="csv">{t("guests.import.csv")}</TabsTrigger>
                      <TabsTrigger value="google">{t("guests.import.google")}</TabsTrigger>
                      <TabsTrigger value="excel">{t("guests.import.excel")}</TabsTrigger>
                      <TabsTrigger value="icloud">{t("guests.import.icloud")}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="csv" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>{t("guests.import.csv")}</Label>
                        <p className="text-sm text-muted-foreground">
                          {t("guests.import.csvDescription")}
                        </p>
                        <Input
                          type="file"
                          accept=".csv"
                          ref={fileInputRef}
                          onChange={handleCSVImport}
                          disabled={importing}
                        />
                        {importing && (
                          <div className="space-y-2">
                            <Progress value={importProgress} />
                            <p className="text-sm text-center">
                              {importProgress}%
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="google" className="pt-4">
                      <Button
                        onClick={() => handleServiceImport("Google Contacts")}
                        className="w-full gap-2"
                      >
                        <FileSpreadsheet className="h-4 w-4" />
                        {t("guests.import.connectGoogle")}
                      </Button>
                    </TabsContent>

                    <TabsContent value="excel" className="pt-4">
                      <Alert>
                        <AlertDescription>
                          {t("guests.import.excelNotAvailable")}
                        </AlertDescription>
                      </Alert>
                    </TabsContent>

                    <TabsContent value="icloud" className="pt-4">
                      <Button
                        onClick={() => handleServiceImport("iCloud")}
                        className="w-full gap-2"
                        variant="outline"
                      >
                        {t("guests.import.connectIcloud")}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>

              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {t("guests.import.csv")} Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau principal */}
      <Card>
        <CardHeader>
          <CardTitle>{t("guests.table.title")}</CardTitle>
          <CardDescription>
            {filterChannel !== "all" 
              ? `${filteredGuests.length} ${t("guests.table.descriptionFiltered")} (${filterChannel})`
              : `${filteredGuests.length} ${t("guests.table.description")}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">{t("guests.table.headers.status")}</TableHead>
                  <TableHead>{t("guests.table.headers.channel")}</TableHead>
                  <TableHead>{t("guests.table.headers.name")}</TableHead>
                  <TableHead>{t("guests.table.headers.contact")}</TableHead>
                  <TableHead>{t("guests.table.headers.countryCode")}</TableHead>
                  <TableHead className="text-right">{t("guests.table.headers.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Formulaire d'ajout en première ligne */}
                <TableRow className="bg-secondary">
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50">
                      {t("guests.table.status.new")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <RadioGroup
                      value={newGuest.channel}
                      onValueChange={(value) =>
                        setNewGuest({ ...newGuest, channel: value })
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="whatsapp" id="new-whatsapp" />
                        <Label
                          htmlFor="new-whatsapp"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <MessageCircle className="h-4 w-4" />
                          {t("guests.table.channels.whatsapp")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="new-email" />
                        <Label
                          htmlFor="new-email"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Mail className="h-4 w-4" />
                          {t("guests.table.channels.email")}
                        </Label>
                      </div>
                    </RadioGroup>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={newGuest.name}
                      onChange={(e) =>
                        setNewGuest({ ...newGuest, name: e.target.value })
                      }
                      placeholder={t("guests.table.placeholders.name")}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    {newGuest.channel === "whatsapp" ? (
                      <div className="flex gap-2">
                        <Select
                          value={newGuest.countryCode}
                          onValueChange={(value) =>
                            setNewGuest({ ...newGuest, countryCode: value })
                          }
                        >
                          <SelectTrigger className="w-24">
                            <Globe className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Code" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRY_CODES.map((country) => (
                              <SelectItem
                                key={country.code}
                                value={country.code}
                              >
                                {country.flag} {country.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          value={newGuest.phone}
                          onChange={(e) =>
                            setNewGuest({ ...newGuest, phone: e.target.value })
                          }
                          placeholder={t("guests.table.placeholders.phone")}
                          className="flex-1"
                        />
                      </div>
                    ) : (
                      <Input
                        value={newGuest.email}
                        onChange={(e) =>
                          setNewGuest({ ...newGuest, email: e.target.value })
                        }
                        placeholder={t("guests.table.placeholders.email")}
                        className="w-full"
                        type="email"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {newGuest.channel === "whatsapp" ? (
                      <Badge variant="outline" className="bg-gray-100">
                        {
                          COUNTRY_CODES.find(
                            (c) => c.code === newGuest.countryCode
                          )?.flag
                        }{" "}
                        {newGuest.countryCode}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={handleAddGuest}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={
                        !newGuest.name.trim() ||
                        (newGuest.channel === "whatsapp" &&
                          !newGuest.phone.trim()) ||
                        (newGuest.channel === "email" && !newGuest.email.trim())
                      }
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {t("guests.table.actions.add")}
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Liste des invités existants */}
                {filteredGuests.length > 0 ? (
                  filteredGuests.map((guest: any) => (
                    <TableRow
                      key={guest.id}
                      className={
                        editingId === guest.id
                          ? "bg-yellow-50"
                          : "hover:bg-accent"
                      }
                      onDoubleClick={() => startEditing(guest)}
                    >
                      <TableCell>
                        <Badge
                          variant={guest.valid ? "default" : "destructive"}
                          className={
                            guest.valid
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : ""
                          }
                        >
                          {guest.valid ? t("guests.table.status.valid") : t("guests.table.status.invalid")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {guest.channel === "whatsapp" ? (
                            <MessageCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Mail className="h-4 w-4 text-blue-600" />
                          )}
                          {renderEditableCell(
                            guest,
                            "channel",
                            guest.channel === "whatsapp" ? t("guests.table.channels.whatsapp") : t("guests.table.channels.email")
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {renderEditableCell(guest, "name", guest.name)}
                      </TableCell>
                      <TableCell>
                        {guest.channel === "whatsapp"
                          ? renderEditableCell(guest, "phone", guest.phone)
                          : renderEditableCell(guest, "email", guest.email)}
                      </TableCell>
                      <TableCell>
                        {guest.channel === "whatsapp" && guest.countryCode ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {
                                COUNTRY_CODES.find(
                                  (c) => c.code === guest.countryCode
                                )?.flag
                              }
                            </span>
                            <span>{guest.countryCode}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {editingId === guest.id ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEdit}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => saveEdit(guest.id, guest)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEditing(guest)}
                                title={t("guests.table.actions.edit")}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleGuestDelete(guest.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                title={t("guests.table.actions.delete")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {guests && guests.length > 0
                        ? t("guests.table.empty.noResults")
                        : t("guests.table.empty.noGuests")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between gap-4 pt-6 border-t">
        <Button variant="outline" onClick={() => setStep(0)} className="px-6">
          {t("guests.navigation.backToDesign")}
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!guests || guests.length === 0 || validCount === 0}
          className="px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          {t("guests.navigation.continueToPreview")}
        </Button>
      </div>
    </div>
  );
}
