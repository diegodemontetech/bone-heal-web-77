
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/auth';
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAdminMaster: boolean;
  isDentist: boolean;
  hasPermission: (permission: string) => boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: DentistSignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

interface DentistSignUpData {
  email: string;
  password: string;
  full_name: string;
  specialty?: string;
  cro?: string;
  cpf?: string;
  cnpj?: string;
  address?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  zip_code?: string;
  phone?: string;
  pessoa_tipo?: 'fisica' | 'juridica';
  razao_social?: string;
  nome_fantasia?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verifica se o usuário é admin ou admin master
  const isAdmin = !!profile?.role && [UserRole.ADMIN, UserRole.ADMIN_MASTER].includes(profile.role);
  const isAdminMaster = profile?.role === UserRole.ADMIN_MASTER;
  const isDentist = profile?.role === UserRole.DENTIST;

  // Busca o perfil completo do usuário
  const fetchProfile = async (userId: string) => {
    try {
      // Buscar perfil básico
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Buscar permissões se for admin
      if (profileData && (profileData.role === UserRole.ADMIN || profileData.role === UserRole.ADMIN_MASTER)) {
        const { data: permissions, error: permissionsError } = await supabase
          .from('user_permissions')
          .select('permission')
          .eq('user_id', userId);

        if (permissionsError) throw permissionsError;

        // Adicionar permissões ao perfil
        setProfile({
          ...profileData,
          permissions: permissions?.map(p => p.permission) || []
        });
      } else {
        setProfile(profileData);
      }
    } catch (error: any) {
      console.error('Erro ao buscar perfil:', error.message);
      toast.error('Erro ao carregar dados do perfil');
    }
  };

  // Verifica se o usuário tem uma permissão específica
  const hasPermission = (permission: string) => {
    if (isAdminMaster) return true; // Admin master tem todas as permissões
    return profile?.permissions?.includes(permission) || false;
  };

  // Atualiza o perfil do usuário
  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  // Login
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      // Usuário logado com sucesso, o perfil será carregado pelo listener de auth state
    } catch (error: any) {
      console.error('Erro no login:', error.message);
      toast.error(error.message || 'Erro ao realizar login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Registro de Dentista (Cliente)
  const signUp = async (data: DentistSignUpData) => {
    try {
      setIsLoading(true);
      const pessoa_fisica = data.pessoa_tipo === 'fisica';
      
      // Criar usuário na auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role: UserRole.DENTIST,
            cro: data.cro,
            specialty: data.specialty,
            address: data.address,
            city: data.city,
            state: data.state,
            neighborhood: data.neighborhood,
            zip_code: data.zip_code,
            phone: data.phone,
            cpf: data.cpf,
            cnpj: data.cnpj,
            pessoa_fisica: pessoa_fisica,
            razao_social: data.razao_social,
            nome_fantasia: data.nome_fantasia
          }
        }
      });

      if (authError) throw authError;

      toast.success('Cadastro realizado com sucesso! Verifique seu email para confirmar sua conta.');
    } catch (error: any) {
      console.error('Erro no cadastro:', error.message);
      toast.error(error.message || 'Erro ao realizar cadastro');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
    } catch (error: any) {
      console.error('Erro ao sair:', error.message);
      toast.error('Erro ao sair da conta');
    }
  };

  // Listener para mudanças no estado de autenticação
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        setUser(newSession?.user || null);

        if (newSession?.user) {
          await fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    // Carregar sessão inicial
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session: initialSession } } = await supabase.auth.getSession();

        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          await fetchProfile(initialSession.user.id);
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    profile,
    isLoading,
    isAdmin,
    isAdminMaster,
    isDentist,
    hasPermission,
    signIn,
    signUp,
    signOut,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
