import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import type { MailingStats } from "@/api/services/mailingStatsService";

interface MailingStatsCardProps {
  stats: MailingStats | null;
  loading: boolean;
  error: string | null;
}

export function MailingStatsCard({
  stats,
  loading,
  error,
}: MailingStatsCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert className="bg-red-50 border-red-200">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">{error}</AlertDescription>
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          Aucune statistique disponible
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques globales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Statistiques globales
          </CardTitle>
          <CardDescription>Résumé de tous les envois</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">Total envoyés</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.total_sent}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600">Livrés</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.total_delivered}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-gray-600">Échoués</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {stats.total_failed}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {stats.total_pending}
              </p>
            </div>
          </div>

          {/* Taux de réussite */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600">Taux de réussite</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.success_rate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-gray-600">Taux d'échec</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {stats.failure_rate.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques par canal */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques par canal</CardTitle>
          <CardDescription>
            Détail des envois par type de communication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3">Email</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Envoyés:</span>
                  <span className="font-medium">
                    {stats.by_channel.email.sent}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livrés:</span>
                  <span className="font-medium text-green-600">
                    {stats.by_channel.email.delivered}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Échoués:</span>
                  <span className="font-medium text-red-600">
                    {stats.by_channel.email.failed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">En attente:</span>
                  <span className="font-medium text-yellow-600">
                    {stats.by_channel.email.pending}
                  </span>
                </div>
              </div>
            </div>

            {/* SMS */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3">SMS</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Envoyés:</span>
                  <span className="font-medium">
                    {stats.by_channel.sms.sent}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livrés:</span>
                  <span className="font-medium text-green-600">
                    {stats.by_channel.sms.delivered}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Échoués:</span>
                  <span className="font-medium text-red-600">
                    {stats.by_channel.sms.failed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">En attente:</span>
                  <span className="font-medium text-yellow-600">
                    {stats.by_channel.sms.pending}
                  </span>
                </div>
              </div>
            </div>

            {/* MMS */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3">MMS</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Envoyés:</span>
                  <span className="font-medium">
                    {stats.by_channel.mms.sent}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livrés:</span>
                  <span className="font-medium text-green-600">
                    {stats.by_channel.mms.delivered}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Échoués:</span>
                  <span className="font-medium text-red-600">
                    {stats.by_channel.mms.failed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">En attente:</span>
                  <span className="font-medium text-yellow-600">
                    {stats.by_channel.mms.pending}
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3">WhatsApp</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Envoyés:</span>
                  <span className="font-medium">
                    {stats.by_channel.whatsapp.sent}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livrés:</span>
                  <span className="font-medium text-green-600">
                    {stats.by_channel.whatsapp.delivered}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Échoués:</span>
                  <span className="font-medium text-red-600">
                    {stats.by_channel.whatsapp.failed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">En attente:</span>
                  <span className="font-medium text-yellow-600">
                    {stats.by_channel.whatsapp.pending}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Envois récents */}
      {stats.recent_mailings && stats.recent_mailings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Envois récents</CardTitle>
            <CardDescription>Historique des derniers envois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recent_mailings.map((mailing) => (
                <div
                  key={mailing.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {mailing.subject}
                    </p>
                    <p className="text-sm text-gray-600">
                      {mailing.channel} •{" "}
                      {new Date(mailing.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{mailing.delivered_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>{mailing.failed_count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
