import { EmailRequest, BulkEmailRequest, EmailResponse, BulkEmailResponse } from '@/types/email';

const API_BASE_URL = 'http://localhost:8000/api';

export const emailService = {
  async sendInvitation(emailData: EmailRequest): Promise<EmailResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/email/send-invitation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur envoi email:', error);
      throw error;
    }
  },

  async sendBulkInvitations(invitations: BulkEmailRequest): Promise<BulkEmailResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/email/send-bulk-invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invitations),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur envoi emails groupés:', error);
      throw error;
    }
  },
};