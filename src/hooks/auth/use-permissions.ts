
import { useState, useCallback } from 'react';
import { UserPermission } from '@/types/auth';

export const usePermissions = () => {
  const hasPermission = useCallback((
    permissions: UserPermission[], 
    permission: UserPermission, 
    isAdminMaster: boolean
  ) => {
    // Admin masters have all permissions
    if (isAdminMaster) {
      return true;
    }
    
    return permissions.includes(permission);
  }, []);

  return { hasPermission };
};
