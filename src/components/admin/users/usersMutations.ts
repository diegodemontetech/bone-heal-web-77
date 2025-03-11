
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth';
import { NewUser } from './types';

export const useUserMutations = () => {
  const queryClient = useQueryClient();

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

  return {
    createUserMutation,
    updateUserPermissionsMutation,
    deleteUserMutation
  };
};
