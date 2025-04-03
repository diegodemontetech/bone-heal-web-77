
import { useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { fetchUserProfile, fetchUserPermissions } from './auth-service';
import { UserPermission } from '@/types/auth';

export const useProfileProcessor = () => {
  const processUserProfile = useCallback(async (session: Session) => {
    const userId = session.user.id;
    
    // Fetch profile and permissions in parallel
    const [profile, permissions] = await Promise.all([
      fetchUserProfile(userId),
      fetchUserPermissions(userId)
    ]);
    
    console.log("Perfil carregado:", profile);
    console.log("Permissões carregadas:", permissions);
    
    // Return processed data
    return {
      profile,
      permissions: permissions || [] as UserPermission[]
    };
  }, []);
  
  return { processUserProfile };
};
