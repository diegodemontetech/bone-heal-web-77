
import { Session } from '@supabase/supabase-js';

export enum UserRole {
  DENTIST = 'dentist',
  ADMIN = 'admin',
  ADMIN_MASTER = 'admin_master'
}

export enum UserPermission {
  MANAGE_PRODUCTS = 'manage_products',
  MANAGE_ORDERS = 'manage_orders',
  MANAGE_CUSTOMERS = 'manage_customers',
  MANAGE_SUPPORT = 'manage_support',
  MANAGE_USERS = 'manage_users',
  VIEW_REPORTS = 'view_reports',
  MANAGE_SETTINGS = 'manage_settings',
  MANAGE_INTEGRATIONS = 'manage_integrations'
}

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  phone?: string;
  cro?: string;
  specialty?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  neighborhood?: string;
  cpf?: string;
  cnpj?: string;
  pessoa_fisica?: boolean;
  permissions?: UserPermission[];
  created_at?: string;
  updated_at?: string;
  is_omie_synced?: boolean;
  omie_code?: string;
  endereco_numero?: string;
  complemento?: string;
  avatar_url?: string;
  is_admin?: boolean; // Adicionando a propriedade is_admin que estava faltando
}

export interface AuthContextType {
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isDentist: boolean;
  isAdmin: boolean;
  isAdminMaster: boolean;
  hasPermission: (permission: UserPermission) => boolean;
  isAuthenticated: boolean; // Adicionando propriedade necessária
}
