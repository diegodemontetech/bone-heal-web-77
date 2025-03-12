
import { UserRole } from '@/types/auth';

export interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_admin: boolean;
  created_at: string;
  permissions: string[];
  omie_code?: string;
  omie_sync?: boolean;
}

export interface NewUser {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  permissions: string[];
}

export interface UsersContextType {
  users: UserData[];
  isLoading: boolean;
  error: Error | null;
  createUser: (user: any) => Promise<void>;
  updateUserPermissions: (userId: string, permissions: string[]) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  availablePermissions: { id: string, label: string }[];
}
