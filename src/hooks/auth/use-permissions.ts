
import { UserPermission, UserProfile, UserRole } from "@/types/auth";

export function usePermissions() {
  // Verifica se o usuário tem uma permissão específica
  const hasPermission = (
    permissions: UserPermission[], 
    permission: UserPermission, 
    isAdminMaster: boolean
  ) => {
    // Para debug
    console.log(`Verificando permissão ${permission}:`, isAdminMaster || permissions.includes(permission));
    
    // Administradores master sempre têm todas as permissões
    if (isAdminMaster) return true;
    
    // Verificar se a permissão existe no array de permissões
    return permissions.includes(permission);
  };

  // Obter permissões padrão para administradores
  const getDefaultAdminPermissions = (): UserPermission[] => {
    return [
      UserPermission.MANAGE_USERS,
      UserPermission.MANAGE_PRODUCTS,
      UserPermission.MANAGE_ORDERS,
      UserPermission.MANAGE_CUSTOMERS,
      UserPermission.MANAGE_SETTINGS,
      UserPermission.MANAGE_INTEGRATIONS,
      UserPermission.MANAGE_SUPPORT
    ];
  };

  // Verificar se um usuário é admin com base no perfil
  const checkIfUserIsAdmin = (profile: UserProfile | null): boolean => {
    if (!profile) return false;
    
    return (
      profile.role === UserRole.ADMIN || 
      profile.role === UserRole.ADMIN_MASTER || 
      profile.is_admin === true
    );
  };

  // Obter as permissões finais do usuário com base no perfil e nas permissões carregadas
  const getFinalPermissions = (
    loadedPermissions: UserPermission[],
    isAdmin: boolean
  ): UserPermission[] => {
    if (loadedPermissions.length > 0) {
      return loadedPermissions;
    } else if (isAdmin) {
      return getDefaultAdminPermissions();
    } else {
      return [];
    }
  };

  return {
    hasPermission,
    getDefaultAdminPermissions,
    checkIfUserIsAdmin,
    getFinalPermissions
  };
}
