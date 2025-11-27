import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  RotateCcw,
} from "lucide-react";
import { BulkSendStatus } from "@/api/services/bulkSendService";

interface BulkSendProgressProps {
  bulkSendId: string;
  onCheckStatus: (id: string) => Promise<BulkSendStatus>;
  onCancel: (id: string) => Promise<void>;
  onRetry: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function BulkSendProgress({
  bulkSendId,
  onCheckStatus,
  onCancel,
  onRetry,
  isLoading = false,
}: BulkSendProgressProps) {
  const [status, setStatus] = useState<BulkSendStatus | null>(null);
  const [checking, setChecking] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [retrying, setRetrying] = useState(false);

  // Vérifier le statut toutes les 2 secondes
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setChecking(true);
        const newStatus = await onCheckStatus(bulkSendId);
        setStatus(newStatus);

        // Arrêter la vérification si terminé
        if (
          newStatus.status === "completed" ||
          newStatus.status === "failed"
        ) {
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut:", error);
      } finally {
        setChecking(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [bulkSendId, onCheckStatus]);

  if (!status) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>Chargement du statut...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressPercent =
    status.progress.total > 0
      ? Math.round(
          ((status.progress.sent + status.progress.failed) /
            status.progress.total) *
            100
        )
      : 0;

  const isCompleted = status.status === "completed" || status.status === "failed";
  const hasErrors = status.progress.failed > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Progression de l'envoi</span>
          {status.status === "completed" && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
          {status.status === "failed" && (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          {status.status === "processing" && (
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statut */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Total</p>
            <p className="text-xl font-bold text-blue-600">
              {status.progress.total}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Envoyés</p>
            <p className="text-xl font-bold text-green-600">
              {status.progress.sent}
            </p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Échoués</p>
            <p className="text-xl font-bold text-red-600">
              {status.progress.failed}
            </p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">En attente</p>
            <p className="text-xl font-bold text-yellow-600">
              {status.progress.pending}
            </p>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progression</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Erreurs */}
        {hasErrors && status.errors && status.errors.length > 0 && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <p className="font-medium mb-2">
                {status.errors.length} erreur(s) détectée(s):
              </p>
              <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                {status.errors.slice(0, 5).map((err, idx) => (
                  <li key={idx}>
                    <strong>{err.recipient}:</strong> {err.error}
                  </li>
                ))}
                {status.errors.length > 5 && (
                  <li className="text-gray-600">
                    ... et {status.errors.length - 5} autre(s)
                  </li>
                )}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          {!isCompleted && (
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                setCancelling(true);
                try {
                  await onCancel(bulkSendId);
                } finally {
                  setCancelling(false);
                }
              }}
              disabled={cancelling || isLoading}
            >
              {cancelling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Annulation...
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </>
              )}
            </Button>
          )}

          {isCompleted && hasErrors && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                setRetrying(true);
                try {
                  await onRetry(bulkSendId);
                } finally {
                  setRetrying(false);
                }
              }}
              disabled={retrying || isLoading}
            >
              {retrying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Relance...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Relancer les échoués
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
