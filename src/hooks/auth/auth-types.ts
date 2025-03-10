
import { UserRole, UserPermission, UserProfile } from '@/types/auth';
import { Session } from '@supabase/supabase-js';

export interface AuthState {
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  permissions: UserPermission[];
}

export interface AuthContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isDentist: boolean;
  isAdmin: boolean;
  isAdminMaster: boolean;
  hasPermission: (permission: UserPermission) => boolean;
}
