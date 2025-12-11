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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Search,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface MessageStatus {
  id: string;
  recipient: string;
  name: string;
  channel: "email" | "sms" | "mms" | "whatsapp";
  status: "sent" | "failed" | "pending" | "delivered";
  error?: string;
  timestamp: string;
  message_id?: string;
}

interface SendStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: MessageStatus[];
  channel: "email" | "sms" | "mms" | "whatsapp";
  totalCount: number;
  sentCount: number;
  failedCount: number;
  pendingCount: number;
}

export function SendStatusModal({
  open,
  onOpenChange,
  messages,
  channel,
  totalCount,
  sentCount,
  failedCount,
  pendingCount,
}: SendStatusModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "sent" | "failed" | "pending"
  >("all");
  const [filteredMessages, setFilteredMessages] =
    useState<MessageStatus[]>(messages);

  useEffect(() => {
    let filtered = messages;

    // Filtrer par statut
    if (filterStatus !== "all") {
      filtered = filtered.filter((m) => m.status === filterStatus);
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMessages(filtered);
  }, [messages, searchTerm, filterStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-100 text-green-800">Envoyé</Badge>;
      case "delivered":
        return <Badge className="bg-blue-100 text-blue-800">Livré</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Échoué</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
        );
      default:
        return null;
    }
  };

  const getChannelLabel = (ch: string) => {
    switch (ch) {
      case "email":
        return "Email";
      case "sms":
        return "SMS";
      case "mms":
        return "MMS";
      case "whatsapp":
        return "WhatsApp";
      default:
        return ch;
    }
  };

  const downloadReport = () => {
    const csv = [
      ["Destinataire", "Nom", "Canal", "Statut", "Erreur", "Heure"],
      ...messages.map((m) => [
        m.recipient,
        m.name,
        getChannelLabel(m.channel),
        m.status,
        m.error || "-",
        m.timestamp,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapport-envoi-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Statut des messages - {getChannelLabel(channel)}
          </DialogTitle>
          <DialogDescription>
            Vérifiez le statut de chaque message envoyé
          </DialogDescription>
        </DialogHeader>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-secondary rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-foreground">{totalCount}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Envoyés</p>
            <p className="text-2xl font-bold text-green-600">{sentCount}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Échoués</p>
            <p className="text-2xl font-bold text-red-600">{failedCount}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">En attente</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-3 p-4 border-b">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterStatus}
            onValueChange={(value: any) => setFilterStatus(value)}
          >
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="sent">Envoyés</SelectItem>
              <SelectItem value="delivered">Livrés</SelectItem>
              <SelectItem value="failed">Échoués</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadReport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Télécharger
          </Button>
        </div>

        {/* Liste des messages */}
        <ScrollArea className="flex-1">
          <div className="space-y-2 p-4">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun message ne correspond aux critères de recherche
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start gap-4 p-3 border rounded-lg hover:bg-accent transition"
                >
                  <div className="pt-1">{getStatusIcon(message.status)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {message.name}
                      </p>
                      {getStatusBadge(message.status)}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {message.recipient}
                    </p>
                    {message.error && (
                      <p className="text-xs text-red-600 mt-1">
                        {message.error}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp}
                    </p>
                  </div>

                  <div className="text-right text-xs text-muted-foreground">
                    <p>{getChannelLabel(message.channel)}</p>
                    {message.message_id && (
                      <p className="text-gray-400 mt-1">
                        ID: {message.message_id.slice(0, 8)}...
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          {failedCount > 0 && (
            <Button className="bg-orange-600 hover:bg-orange-700">
              Relancer les échoués ({failedCount})
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
