
import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole, UserPermission } from '@/types/auth';
import { toast } from 'sonner';

interface AuthContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAdminMaster: boolean;
  hasPermission: (permission: UserPermission) => boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<UserPermission[]>([]);

  // Memorizar os valores derivados para evitar cálculos desnecessários
  const isAdmin = useMemo(() => {
    return profile?.role === UserRole.ADMIN || profile?.role === UserRole.ADMIN_MASTER;
  }, [profile]);

  const isAdminMaster = useMemo(() => {
    return profile?.role === UserRole.ADMIN_MASTER;
  }, [profile]);

  // Verificar permissões
  const hasPermission = useCallback((permission: UserPermission): boolean => {
    console.log("Verificando permissão:", permission);
    console.log("Admin Master:", isAdminMaster);
    console.log("Permissões atuais:", permissions);
    
    // Admin Master tem todas as permissões
    if (isAdminMaster) return true;
    
    // Verificar se a permissão específica está na lista
    return permissions.includes(permission);
  }, [isAdminMaster, permissions]);

  // Carregar perfil e permissões do usuário atual
  const loadUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user) {
        console.log("Sessão encontrada:", session.user.id);
        
        // Carregar perfil do usuário
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Erro ao carregar perfil:", profileError);
          throw profileError;
        }
        
        // Para debug - mostra o perfil carregado
        console.log("Perfil carregado:", profileData);
        
        // Definir perfil
        setProfile(profileData);
        
        // Se for admin, carregar permissões
        if (profileData.role === UserRole.ADMIN || profileData.role === UserRole.ADMIN_MASTER) {
          // Admin Master tem todas as permissões
          if (profileData.role === UserRole.ADMIN_MASTER) {
            console.log("Usuário é Admin Master - todas as permissões concedidas");
            // Todos os valores da enum UserPermission
            setPermissions(Object.values(UserPermission));
          } else {
            // Buscar permissões do banco de dados
            const { data: permissionsData, error: permissionsError } = await supabase
              .from('user_permissions')
              .select('permission')
              .eq('user_id', session.user.id);
            
            if (permissionsError) {
              console.error("Erro ao carregar permissões:", permissionsError);
              throw permissionsError;
            }
            
            // Extrair permissões da resposta
            const userPermissions = permissionsData.map(p => p.permission as UserPermission);
            console.log("Permissões carregadas:", userPermissions);
            setPermissions(userPermissions);
          }
        }
      } else {
        console.log("Nenhuma sessão encontrada");
        setProfile(null);
        setPermissions([]);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      toast.error("Erro ao carregar dados do usuário");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Função para atualizar o perfil - adicionada
  const refreshProfile = useCallback(async () => {
    return loadUserProfile();
  }, [loadUserProfile]);

  // Inicializar e atualizar ao montar o componente
  useEffect(() => {
    loadUserProfile();
    
    // Configurar listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Evento de autenticação:", event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await loadUserProfile();
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setPermissions([]);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [loadUserProfile]);

  // Login com email e senha
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      toast.error(`Erro ao fazer login: ${error.message}`);
      throw error;
    }
  };

  // Método de registro - adicionado
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // Registrar o usuário com Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData, // Metadados do usuário que serão salvos
        }
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Erro ao registrar:", error);
      toast.error(`Erro ao registrar: ${error.message}`);
      throw error;
    }
  };

  // Logout
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      toast.error(`Erro ao fazer logout: ${error.message}`);
      throw error;
    }
  };

  const value = {
    profile,
    isLoading,
    isAdmin,
    isAdminMaster,
    hasPermission,
    signIn,
    signOut,
    signUp,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
