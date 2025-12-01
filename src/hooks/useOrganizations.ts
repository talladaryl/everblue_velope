import { useState, useCallback, useEffect } from "react";
import {
  organizationService,
  Organization,
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
} from "@/api/services/organizationService";
import { toast } from "@/components/ui/sonner";

interface UseOrganizationsReturn {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  fetchOrganizations: () => Promise<void>;
  createOrganization: (payload: CreateOrganizationPayload) => Promise<Organization>;
  updateOrganization: (id: number, payload: UpdateOrganizationPayload) => Promise<Organization>;
  deleteOrganization: (id: number) => Promise<void>;
}

export const useOrganizations = (): UseOrganizationsReturn => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await organizationService.getOrganizations();
      setOrganizations(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors du chargement des organisations";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrganizationHandler = useCallback(
    async (payload: CreateOrganizationPayload): Promise<Organization> => {
      try {
        const newOrganization = await organizationService.createOrganization(payload);
        setOrganizations((prev) => [newOrganization, ...prev]);
        toast.success("Organisation créée avec succès!");
        return newOrganization;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de la création de l'organisation";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      }
    },
    []
  );

  const updateOrganizationHandler = useCallback(
    async (id: number, payload: UpdateOrganizationPayload): Promise<Organization> => {
      try {
        const updatedOrganization = await organizationService.updateOrganization(id, payload);
        setOrganizations((prev) =>
          prev.map((o) => (o.id === id ? updatedOrganization : o))
        );
        toast.success("Organisation mise à jour avec succès!");
        return updatedOrganization;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de la mise à jour de l'organisation";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      }
    },
    []
  );

  const deleteOrganizationHandler = useCallback(async (id: number): Promise<void> => {
    try {
      await organizationService.deleteOrganization(id);
      setOrganizations((prev) => prev.filter((o) => o.id !== id));
      toast.success("Organisation supprimée avec succès!");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de la suppression de l'organisation";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return {
    organizations,
    loading,
    error,
    fetchOrganizations,
    createOrganization: createOrganizationHandler,
    updateOrganization: updateOrganizationHandler,
    deleteOrganization: deleteOrganizationHandler,
  };
};
