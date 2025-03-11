
import React from 'react';
import { UsersContext } from './UsersContext';
import { useUsersQuery } from './usersQuery';
import { useUserMutations } from './usersMutations';
import { UsersContextType, NewUser } from './types';
import { availablePermissions } from './permissions';

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
