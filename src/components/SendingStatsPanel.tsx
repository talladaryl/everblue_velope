import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  Mail,
  MessageSquare,
  Smartphone,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface SendingMessage {
  id: string;
  recipient: string;
  name: string;
  channel: "email" | "sms" | "mms" | "whatsapp";
  status: "sent" | "failed" | "pending" | "delivered";
  error?: string;
  timestamp: string;
  message_id?: string;
}

interface SendingStatsPanelProps {
  messages: SendingMessage[];
  channel: "email" | "sms" | "mms" | "whatsapp";
  totalCount: number;
  sentCount: number;
  failedCount: number;
  pendingCount: number;
  onRetry?: (messageId: string) => Promise<void>;
  loading?: boolean;
}

export function SendingStatsPanel({
  messages,
  channel,
  totalCount,
  sentCount,
  failedCount,
  pendingCount,
  onRetry,
  loading = false,
}: SendingStatsPanelProps) {
  const [retryingIds, setRetryingIds] = useState<Set<string>>(new Set());

  const getChannelIcon = (ch: string) => {
    switch (ch) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
      case "mms":
        return <MessageSquare className="h-4 w-4" />;
      case "whatsapp":
        return <Smartphone className="h-4 w-4" />;
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

  const handleRetry = async (messageId: string) => {
    if (!onRetry) return;

    setRetryingIds((prev) => new Set(prev).add(messageId));
    try {
      await onRetry(messageId);
    } finally {
      setRetryingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  const sentMessages = messages.filter(
    (m) => m.status === "sent" || m.status === "delivered"
  );
  const failedMessages = messages.filter((m) => m.status === "failed");
  const pendingMessages = messages.filter((m) => m.status === "pending");

  const successRate =
    totalCount > 0 ? Math.round((sentCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Statistiques globales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getChannelIcon(channel)}
            Statistiques d'envoi - {getChannelLabel(channel)}
          </CardTitle>
          <CardDescription>Résumé des messages envoyés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {totalCount}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600">Envoyés</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {sentCount}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-gray-600">Échoués</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {failedCount}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {pendingCount}
              </p>
            </div>
          </div>

          {/* Taux de réussite */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">
                Taux de réussite
              </p>
              <p className="text-2xl font-bold text-green-600">
                {successRate}%
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${successRate}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets détaillés */}
      <Tabs defaultValue="sent" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Envoyés ({sentCount})
          </TabsTrigger>
          <TabsTrigger value="failed" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Échoués ({failedCount})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            En attente ({pendingCount})
          </TabsTrigger>
        </TabsList>

        {/* Messages envoyés */}
        <TabsContent value="sent">
          <Card>
            <CardContent className="pt-6">
              {sentMessages.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucun message envoyé
                </p>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-3 pr-4">
                    {sentMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="flex items-start gap-4 p-3 border rounded-lg hover:bg-accent"
                      >
                        <div className="pt-1">{getStatusIcon(msg.status)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm truncate">
                              {msg.name}
                            </p>
                            {getStatusBadge(msg.status)}
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {msg.recipient}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(msg.timestamp).toLocaleString("fr-FR")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages échoués */}
        <TabsContent value="failed">
          <Card>
            <CardContent className="pt-6">
              {failedMessages.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucun message échoué
                </p>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-3 pr-4">
                    {failedMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="flex items-start gap-4 p-3 border rounded-lg hover:bg-red-50"
                      >
                        <div className="pt-1">{getStatusIcon(msg.status)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm truncate">
                              {msg.name}
                            </p>
                            {getStatusBadge(msg.status)}
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {msg.recipient}
                          </p>
                          {msg.error && (
                            <p className="text-xs text-red-600 mt-1">
                              {msg.error}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(msg.timestamp).toLocaleString("fr-FR")}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRetry(msg.id)}
                          disabled={retryingIds.has(msg.id) || loading}
                          className="flex-shrink-0"
                        >
                          {retryingIds.has(msg.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RotateCcw className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages en attente */}
        <TabsContent value="pending">
          <Card>
            <CardContent className="pt-6">
              {pendingMessages.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucun message en attente
                </p>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-3 pr-4">
                    {pendingMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="flex items-start gap-4 p-3 border rounded-lg hover:bg-yellow-50"
                      >
                        <div className="pt-1">{getStatusIcon(msg.status)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm truncate">
                              {msg.name}
                            </p>
                            {getStatusBadge(msg.status)}
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {msg.recipient}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(msg.timestamp).toLocaleString("fr-FR")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
