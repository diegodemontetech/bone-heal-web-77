
-- Criar enum para tipos de permissões
CREATE TYPE user_permission AS ENUM (
  'manage_products',
  'manage_orders',
  'manage_customers',
  'manage_support',
  'manage_users',
  'view_reports',
  'manage_settings',
  'manage_integrations'
);

-- Tabela de permissões de usuário
CREATE TABLE user_permissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  permission user_permission NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, permission)
);

-- Tabela de chamados de suporte
CREATE TABLE support_tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  number serial,
  customer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  subject text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'open' NOT NULL,
  priority text DEFAULT 'normal' NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Tabela de mensagens dos chamados
CREATE TABLE ticket_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id uuid REFERENCES support_tickets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  message text NOT NULL,
  attachments text[],
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
