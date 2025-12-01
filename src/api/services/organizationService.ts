import axios from "../axios";

export interface Organization {
  id: number;
  owner_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrganizationPayload {
  name: string;
}

export interface UpdateOrganizationPayload {
  name?: string;
}

export const organizationService = {
  async getOrganizations(): Promise<Organization[]> {
    const response = await axios.get("/organizations");
    return response.data;
  },

  async getOrganization(id: number): Promise<Organization> {
    const response = await axios.get(`/organizations/${id}`);
    return response.data;
  },

  async createOrganization(payload: CreateOrganizationPayload): Promise<Organization> {
    const response = await axios.post("/organizations", payload);
    return response.data;
  },

  async updateOrganization(
    id: number,
    payload: UpdateOrganizationPayload
  ): Promise<Organization> {
    const response = await axios.put(`/organizations/${id}`, payload);
    return response.data;
  },

  async deleteOrganization(id: number): Promise<void> {
    await axios.delete(`/organizations/${id}`);
  },
};
