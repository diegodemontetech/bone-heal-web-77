import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile, UserRole } from '@/types/auth';

interface UsersContextType {
  users: UserProfile[];
  loading: boolean;
  error: Error | null;
  fetchUsers: () => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  createUser: (userData: Partial<UserProfile>) => Promise<UserProfile | null>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

interface UsersProviderProps {
  children: ReactNode;
}

export const UsersProvider: React.FC<UsersProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data as UserProfile[]);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;
      
      // Update local state
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, role } : user
        )
      );
      
      toast.success('User role updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating user role:', err);
      toast.error('Failed to update user role');
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      // Check if user has admin permissions
      const userToDelete = users.find(user => user.id === userId);
      if (!userToDelete) {
        toast.error('User not found');
        return false;
      }

      // Check if trying to delete an admin user
      const userRole = userToDelete.role;
      if (userRole === UserRole.DENTIST || userRole === UserRole.ADMIN_MASTER) return true;
      if (userRole === UserRole.ADMIN) return true;
      return false;

      // Delete user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      // Delete user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;
      
      // Update local state
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      toast.success('User deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user');
      return false;
    }
  };

  const createUser = async (userData: Partial<UserProfile>): Promise<UserProfile | null> => {
    try {
      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email!,
        password: 'temporary-password',
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name,
          role: userData.role
        }
      });

      if (authError) throw authError;
      
      // Profile should be created by trigger
      const userId = authData.user.id;
      
      // Update profile with additional data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({
          ...userData,
          id: userId
        })
        .eq('id', userId)
        .select()
        .single();

      if (profileError) throw profileError;
      
      // Update local state
      setUsers(prev => [profileData as UserProfile, ...prev]);
      
      toast.success('User created successfully');
      return profileData as UserProfile;
    } catch (err) {
      console.error('Error creating user:', err);
      toast.error('Failed to create user');
      return null;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider
      value={{
        users,
        loading,
        error,
        fetchUsers,
        updateUserRole,
        deleteUser,
        createUser
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
