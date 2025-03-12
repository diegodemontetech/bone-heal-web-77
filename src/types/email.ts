
import { Json } from "@/integrations/supabase/types";

export interface EmailTemplate {
  id?: string;
  name: string;
  subject: string;
  body: string;
  event_type: string;
  trigger_event?: string;
  variables?: Json;
  active?: boolean;
  auto_send?: boolean;
  created_at?: string;
  updated_at?: string;
}
