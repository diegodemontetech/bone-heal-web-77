
import React, { createContext } from 'react';
import { useUsersQuery } from './users/usersQuery';
import { useUserMutations } from './users/usersMutations';
import { UsersContextType, NewUser } from './users/types';
import { availablePermissions } from './users/permissions';

export const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: users = [], isLoading, error } = useUsersQuery();
  const { createUserMutation, updateUserPermissionsMutation, deleteUserMutation } = useUserMutations();

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

// Re-exportar o useUsers e availablePermissions para manter a API pública consistente
export { useUsers } from './users/useUsers';
export { availablePermissions } from './users/permissions';
