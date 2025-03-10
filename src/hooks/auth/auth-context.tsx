
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserPermission, UserProfile } from '@/types/auth';
import { toast } from 'sonner';
import { AuthContextType, AuthState } from './auth-types';
import { 
  fetchSession, 
  fetchUserProfile, 
  fetchUserPermissions,
  signInWithEmail,
  signUpWithEmail,
  signOutUser
} from './auth-service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    profile: null,
    session: null,
    isLoading: true,
    permissions: []
  });

  const fetchProfileData = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const currentSession = await fetchSession();
      
      if (!currentSession) {
        setAuthState({
          profile: null,
          session: null,
          isLoading: false,
          permissions: []
        });
        return;
      }
      
      const userId = currentSession.user.id;
      const profileData = await fetchUserProfile(userId);
      const userPermissions = await fetchUserPermissions(userId);
      
      // Montar o perfil completo
      const userProfile: UserProfile = profileData ? {
        ...profileData,
        id: userId,
        email: currentSession.user.email || '',
        role: (profileData.role as UserRole) || UserRole.DENTIST,
        permissions: userPermissions
      } : null;
      
      setAuthState({
        profile: userProfile,
        session: currentSession,
        isLoading: false,
        permissions: userPermissions
      });
    } catch (error: any) {
      console.error('Erro ao buscar perfil:', error);
      toast.error('Erro ao buscar perfil: ' + error.message);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchProfileData();
    
    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Evento de autenticação:", event, newSession?.user?.id);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setAuthState(prev => ({ ...prev, session: newSession }));
        fetchProfileData();
      } else if (event === 'SIGNED_OUT') {
        setAuthState({
          profile: null,
          session: null,
          isLoading: false,
          permissions: []
        });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    await fetchProfileData();
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) throw error;
      
      if (data?.session) {
        setAuthState(prev => ({ ...prev, session: data.session }));
        await fetchProfileData();
      }
    } catch (error: any) {
      toast.error("Erro ao fazer login: " + error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await signUpWithEmail(email, password, userData);
      
      if (error) throw error;
      
      toast.success("Cadastro realizado com sucesso! Verifique seu e-mail para confirmar o cadastro.");

      // Retornando os dados para que possamos utilizar o ID do usuário para integrações
      return data;
    } catch (error: any) {
      toast.error("Erro ao cadastrar: " + error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await signOutUser();
      if (error) throw error;
      
      setAuthState({
        profile: null,
        session: null,
        isLoading: false,
        permissions: []
      });
      
      toast.success("Logout realizado com sucesso");
    } catch (error: any) {
      toast.error("Erro ao sair: " + error.message);
      throw error;
    }
  };

  const { profile, isLoading, permissions } = authState;
  
  const isDentist = profile?.role === UserRole.DENTIST;
  const isAdmin = profile?.role === UserRole.ADMIN || profile?.role === UserRole.ADMIN_MASTER;
  const isAdminMaster = profile?.role === UserRole.ADMIN_MASTER;

  const hasPermission = (permission: UserPermission) => {
    if (isAdminMaster) return true;
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      profile,
      isLoading,
      session: authState.session,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      isDentist,
      isAdmin,
      isAdminMaster,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  return context;
};
