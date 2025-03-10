
import { Session } from '@supabase/supabase-js';
import { UserPermission, UserProfile, UserRole } from "@/types/auth";
import { fetchUserProfile, fetchUserPermissions } from './auth-service';
import { usePermissions } from './use-permissions';

export function useProfileProcessor() {
  const { checkIfUserIsAdmin, getFinalPermissions } = usePermissions();

  const processUserProfile = async (session: Session | null): Promise<{
    profile: UserProfile | null;
    permissions: UserPermission[];
  }> => {
    if (!session) {
      return {
        profile: null,
        permissions: []
      };
    }

    const userId = session.user.id;
    const profileData = await fetchUserProfile(userId);
    const userPermissions = await fetchUserPermissions(userId);
    
    console.log("Perfil carregado:", profileData);
    console.log("Permissões carregadas:", userPermissions);
    
    // Verificar se o usuário é admin
    const isAdmin = checkIfUserIsAdmin(profileData);
    
    // Definir as permissões finais
    const finalPermissions = getFinalPermissions(userPermissions, isAdmin);
    
    console.log("Permissões finais:", finalPermissions);
    
    // Montar o perfil completo
    const userProfile: UserProfile = profileData ? {
      ...profileData,
      id: userId,
      email: session.user.email || '',
      role: (profileData.role as UserRole) || UserRole.DENTIST,
      permissions: finalPermissions,
      is_admin: isAdmin // Garantir que is_admin está definido no perfil
    } : null;

    return {
      profile: userProfile,
      permissions: finalPermissions
    };
  };

  return {
    processUserProfile
  };
}
