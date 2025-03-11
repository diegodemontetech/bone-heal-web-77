
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Executando consulta de usuários...');
      
      // Buscar todos os perfis de usuários (admins, dentistas e clientes do Omie)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Erro ao buscar perfis:', profilesError);
        throw profilesError;
      }

      console.log(`Encontrados ${profiles?.length || 0} perfis de usuários`);

      // Buscar permissões para cada usuário
      const usersWithPermissions = await Promise.all(
        profiles.map(async (profile) => {
          const { data: permissions, error: permissionsError } = await supabase
            .from('user_permissions')
            .select('permission')
            .eq('user_id', profile.id);

          if (permissionsError) {
            console.error(`Erro ao buscar permissões para usuário ${profile.id}:`, permissionsError);
            throw permissionsError;
          }

          // Certifique-se de que temos valores padrão para todos os campos necessários
          return {
            ...profile,
            full_name: profile.full_name || (profile.nome_cliente || 'Usuário sem nome'),
            email: profile.email || 'email@indisponivel.com',
            role: profile.role || 'dentist',
            permissions: permissions?.map(p => p.permission) || [],
            created_at: profile.created_at || new Date().toISOString()
          };
        })
      );

      console.log('Usuários com permissões processados:', usersWithPermissions.length);
      return usersWithPermissions;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1
  });
};
