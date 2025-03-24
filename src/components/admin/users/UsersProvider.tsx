
import React, { useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile, UserRole } from '@/types/auth';
import { UsersContext } from './UsersContext';
import { UserData } from './types';
import { availablePermissions } from './permissions';

interface UsersProviderProps {
  children: ReactNode;
}

export const UsersProvider: React.FC<UsersProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Buscar todos os perfis de usuários ADMIN
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_admin', true)  // Filtrar apenas admins
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Buscar permissões para todos os usuários
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('user_permissions')
        .select('user_id, permission');

      if (permissionsError) throw permissionsError;

      // Criar um mapa de permissões por ID de usuário
      const permissionsByUser: Record<string, string[]> = {};
      permissionsData.forEach((item) => {
        if (!permissionsByUser[item.user_id]) {
          permissionsByUser[item.user_id] = [];
        }
        permissionsByUser[item.user_id].push(item.permission);
      });

      // Mapear os perfis para o formato UserData
      const mappedUsers: UserData[] = profilesData.map((profile) => {
        return {
          id: profile.id,
          email: profile.email || '',
          full_name: profile.full_name || '',
          role: profile.role as UserRole || UserRole.ADMIN,
          is_admin: profile.is_admin || false,
          created_at: profile.created_at,
          permissions: permissionsByUser[profile.id] || [],
          omie_code: profile.omie_code,
          omie_sync: profile.omie_sync
        };
      });

      setUsers(mappedUsers);
      console.log(`[UsersProvider] Encontrados ${mappedUsers.length} usuários admin`);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error('Falha ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPermissions = async (userId: string, permissions: string[]) => {
    try {
      // Primeiro remove todas as permissões existentes
      const { error: deleteError } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Insere as novas permissões
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

      // Atualiza o estado local
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, permissions } : user
        )
      );
      
      toast.success('Permissões atualizadas com sucesso');
    } catch (err) {
      console.error('Error updating user permissions:', err);
      toast.error('Falha ao atualizar permissões');
      throw err;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Verificação de segurança antes de excluir (apenas usuários não-admin)
      const userToDelete = users.find(user => user.id === userId);
      if (!userToDelete) {
        toast.error('Usuário não encontrado');
        return;
      }

      if (userToDelete.role === 'admin_master') {
        toast.error('Não é possível excluir um Administrador Master');
        return;
      }

      // Exclui as permissões do usuário
      const { error: permissionsError } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId);

      if (permissionsError) throw permissionsError;

      // Exclui o perfil do usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      // Atualiza o estado local
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      toast.success('Usuário excluído com sucesso');
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Falha ao excluir usuário');
    }
  };

  const createUser = async (userData: any) => {
    try {
      // Criação do usuário na autenticação via API
      const { error: signUpError, data: authData } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password || 'senha123',
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role
          }
        }
      });

      if (signUpError) throw signUpError;

      // Se o usuário tem permissões específicas, adicioná-las
      if (userData.permissions && userData.permissions.length > 0) {
        const permissionsToInsert = userData.permissions.map((permission: string) => ({
          user_id: authData.user!.id,
          permission
        }));

        const { error: permissionsError } = await supabase
          .from('user_permissions')
          .insert(permissionsToInsert);

        if (permissionsError) throw permissionsError;
      }

      toast.success('Usuário criado com sucesso');
      await fetchUsers(); // Atualiza a lista de usuários
    } catch (err) {
      console.error('Error creating user:', err);
      toast.error('Falha ao criar usuário: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider
      value={{
        users,
        isLoading,
        error,
        updateUserPermissions,
        deleteUser,
        createUser,
        availablePermissions
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
