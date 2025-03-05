
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserRole, UserPermission } from '@/types/auth';

interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_admin: boolean;
  created_at: string;
  permissions: string[];
}

interface NewUser {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  permissions: string[];
}

interface UsersContextType {
  users: UserData[];
  isLoading: boolean;
  error: Error | null;
  createUser: (user: NewUser) => Promise<void>;
  updateUserPermissions: (userId: string, permissions: string[]) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  availablePermissions: { id: string, label: string }[];
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const availablePermissions = [
  { id: UserPermission.MANAGE_PRODUCTS, label: 'Gerenciar Produtos' },
  { id: UserPermission.MANAGE_ORDERS, label: 'Gerenciar Pedidos' },
  { id: UserPermission.MANAGE_CUSTOMERS, label: 'Gerenciar Clientes' },
  { id: UserPermission.MANAGE_SUPPORT, label: 'Gerenciar Suporte' },
  { id: UserPermission.MANAGE_USERS, label: 'Gerenciar Usuários' },
  { id: UserPermission.VIEW_REPORTS, label: 'Visualizar Relatórios' },
  { id: UserPermission.MANAGE_SETTINGS, label: 'Gerenciar Configurações' },
  { id: UserPermission.MANAGE_INTEGRATIONS, label: 'Gerenciar Integrações' },
];

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Buscar usuários
  const { 
    data: users = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Buscar perfis de usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .or('is_admin.eq.true,role.eq.' + UserRole.ADMIN + ',role.eq.' + UserRole.ADMIN_MASTER);

      if (profilesError) throw profilesError;

      // Buscar permissões para cada usuário
      const usersWithPermissions = await Promise.all(
        profiles.map(async (profile) => {
          const { data: permissions, error: permissionsError } = await supabase
            .from('user_permissions')
            .select('permission')
            .eq('user_id', profile.id);

          if (permissionsError) throw permissionsError;

          return {
            ...profile,
            permissions: permissions?.map(p => p.permission) || []
          };
        })
      );

      return usersWithPermissions;
    }
  });

  // Criar um novo usuário admin
  const createUserMutation = useMutation({
    mutationFn: async (userData: NewUser) => {
      // Criar usuário no Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role,
            is_admin: true
          }
        }
      });

      if (authError) throw authError;
      if (!data.user) throw new Error("Falha ao criar usuário");

      // Adicionar permissões se não for admin master (que já tem todas)
      if (userData.role !== UserRole.ADMIN_MASTER && userData.permissions.length > 0) {
        const permissionsToInsert = userData.permissions.map(permission => ({
          user_id: data.user!.id,
          permission
        }));

        const { error: permissionsError } = await supabase
          .from('user_permissions')
          .insert(permissionsToInsert);

        if (permissionsError) throw permissionsError;
      }

      return data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Usuário criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar usuário: ${error.message}`);
    }
  });

  // Atualizar permissões do usuário
  const updateUserPermissionsMutation = useMutation({
    mutationFn: async ({ userId, permissions }: { userId: string, permissions: string[] }) => {
      // Remover permissões existentes
      const { error: deleteError } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Adicionar novas permissões
      if (permissions.length > 0) {
        const permissionsToInsert = permissions.map(permission => ({
          user_id: userId,
          permission
        }));

        const { error: insertError } = await supabase
          .from('user_permissions')
          .insert(permissionsToInsert);

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Permissões atualizadas com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar permissões: ${error.message}`);
    }
  });

  // Excluir usuário
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Usuário excluído com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao excluir usuário: ${error.message}`);
    }
  });

  // Funções expostas
  const createUser = async (userData: NewUser) => {
    await createUserMutation.mutateAsync(userData);
  };

  const updateUserPermissions = async (userId: string, permissions: string[]) => {
    await updateUserPermissionsMutation.mutateAsync({ userId, permissions });
  };

  const deleteUser = async (userId: string) => {
    await deleteUserMutation.mutateAsync(userId);
  };

  return (
    <UsersContext.Provider value={{
      users,
      isLoading,
      error,
      createUser,
      updateUserPermissions,
      deleteUser,
      availablePermissions
    }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};
