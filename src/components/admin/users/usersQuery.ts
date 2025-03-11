
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Buscar perfis de usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .or('is_admin.eq.true,role.eq.admin,role.eq.admin_master');

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
};
