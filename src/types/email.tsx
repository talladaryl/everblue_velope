export interface EmailRequest {
  recipient_email: string;
  recipient_name: string;
  invitation_data: {
    token: string;
    design: any;
    event_date?: string;
    event_location?: string;
  };
  custom_message?: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  recipient_email: string;
}

export interface BulkEmailRequest {
  invitations: EmailRequest[];
}

export interface BulkEmailResponse {
  results: EmailResponse[];
  total_sent: number;
  total_failed: number;
}
