
import React from 'react';
import { useAuthContext } from './auth/auth-context';

// Re-exportar o hook com o nome antigo para manter compatibilidade
export const useAuth = useAuthContext;

// Re-exportar o provider para uso no App.tsx
export { AuthProvider } from './auth/auth-context';
