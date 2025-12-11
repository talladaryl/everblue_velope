import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Mail,
  TrendingUp,
} from "lucide-react";

interface SendingStatsProps {
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  pendingCount: number;
  successRate?: number;
}

export const SendingStats: React.FC<SendingStatsProps> = ({
  totalRecipients,
  sentCount,
  failedCount,
  pendingCount,
  successRate = 0,
}) => {
  const percentage =
    totalRecipients > 0 ? (sentCount / totalRecipients) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Barre de progression */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Progression d'envoi</span>
            <Badge variant="outline">{Math.round(percentage)}%</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={percentage} className="h-3" />
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-foreground">
                {totalRecipients}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Envoyés</p>
              <p className="text-2xl font-bold text-green-600">{sentCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-blue-600">{pendingCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Échoués</p>
              <p className="text-2xl font-bold text-red-600">{failedCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Succès</p>
                <p className="text-3xl font-bold text-green-700">{sentCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">En attente</p>
                <p className="text-3xl font-bold text-blue-700">
                  {pendingCount}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Échoués</p>
                <p className="text-3xl font-bold text-red-700">{failedCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Taux</p>
                <p className="text-3xl font-bold text-purple-700">
                  {Math.round(successRate)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
