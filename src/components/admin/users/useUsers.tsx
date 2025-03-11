
import { useContext } from 'react';
import { UsersContext } from './UsersContext';

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers deve ser usado dentro de um UsersProvider');
  }
  return context;
};
