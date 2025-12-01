import { useState, useCallback, useEffect } from "react";
import { mailingStatsService, MailingStats } from "@/api/services/mailingStatsService";
import { toast } from "@/components/ui/sonner";

interface UseMailingStatsReturn {
  stats: MailingStats | null;
  loading: boolean;
  error: string | null;
  fetchEventStats: (eventId: number) => Promise<void>;
  fetchGlobalStats: () => Promise<void>;
  fetchStatsByChannel: (eventId: number, channel: string) => Promise<void>;
  fetchStatsByDateRange: (eventId: number, startDate: string, endDate: string) => Promise<void>;
}

export const useMailingStats = (): UseMailingStatsReturn => {
  const [stats, setStats] = useState<MailingStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEventStats = useCallback(async (eventId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await mailingStatsService.getEventStats(eventId);
      setStats(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors du chargement des statistiques";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGlobalStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mailingStatsService.getGlobalStats();
      setStats(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors du chargement des statistiques globales";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatsByChannel = useCallback(
    async (eventId: number, channel: string) => {
      try {
        setLoading(true);
        setError(null);
        const data = await mailingStatsService.getStatsByChannel(eventId, channel);
        setStats(data);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors du chargement des statistiques par canal";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchStatsByDateRange = useCallback(
    async (eventId: number, startDate: string, endDate: string) => {
      try {
        setLoading(true);
        setError(null);
        const data = await mailingStatsService.getStatsByDateRange(eventId, startDate, endDate);
        setStats(data);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors du chargement des statistiques par période";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    stats,
    loading,
    error,
    fetchEventStats,
    fetchGlobalStats,
    fetchStatsByChannel,
    fetchStatsByDateRange,
  };
};
