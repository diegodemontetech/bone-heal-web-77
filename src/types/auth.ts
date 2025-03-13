
export interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: User;
}

export interface User {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: AppMetadata;
  user_metadata: UserMetadata;
  identities: Identity[];
  created_at: string;
  updated_at: string;
}

export interface AppMetadata {
  provider: string;
  [key: string]: any;
}

export interface UserMetadata {
  avatar_url: string;
  email: string;
  email_change_count: number;
  full_name: string;
  iss: string;
  name: string;
  phone: string;
  provider_id: string;
  sub: string;
  [key: string]: any;
}

export interface Identity {
  id: string;
  user_id: string;
  identity_data: IdentityData;
  provider: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string;
}

export interface IdentityData {
  avatar_url: string;
  email: string;
  name: string;
  sub: string;
  email_verified: boolean;
  [key: string]: any;
}

export enum UserPermission {
  MANAGE_PRODUCTS = 'manage_products',
  MANAGE_ORDERS = 'manage_orders',
  MANAGE_CUSTOMERS = 'manage_customers',
  MANAGE_SUPPORT = 'manage_support',
  MANAGE_USERS = 'manage_users',
  VIEW_REPORTS = 'view_reports',
  MANAGE_SETTINGS = 'manage_settings',
  MANAGE_INTEGRATIONS = 'manage_integrations',
  MANAGE_LEADS = 'manage_leads'
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff',
  CUSTOMER = 'customer'
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  role?: UserRole;
  is_admin?: boolean;
  specialty?: string;
  omie_code?: string;
}
