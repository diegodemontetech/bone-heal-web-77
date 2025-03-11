
import { createContext } from 'react';
import { UsersContextType } from './types';

// Criação do contexto com tipo adequado
export const UsersContext = createContext<UsersContextType | undefined>(undefined);
