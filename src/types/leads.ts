export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  reason: string;
  source: string;
  status: string;
  created_at: string;
  message?: string;
}
