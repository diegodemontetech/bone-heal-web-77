
import { createContext } from 'react';
import { UsersContextType } from './types';

// Criação do contexto com tipo adequado e valor inicial
export const UsersContext = createContext<UsersContextType | undefined>(undefined);
