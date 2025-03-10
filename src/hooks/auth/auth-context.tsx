
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserPermission, UserProfile } from '@/types/auth';
import { toast } from 'sonner';
import { AuthContextType, AuthState } from './auth-types';
import { fetchSession } from './auth-service';
import { usePermissions } from './use-permissions';
import { useProfileProcessor } from './use-profile-processor';
import { useAuthFunctions } from './use-auth-functions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    profile: null,
    session: null,
    isLoading: true,
    permissions: []
  });

  const { hasPermission } = usePermissions();
  const { processUserProfile } = useProfileProcessor();
  const { signIn, signUp, signOut } = useAuthFunctions();

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
      
      const { profile, permissions } = await processUserProfile(currentSession);
      
      setAuthState({
        profile,
        session: currentSession,
        isLoading: false,
        permissions
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

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { data } = await signIn(email, password);
      
      if (data?.session) {
        setAuthState(prev => ({ ...prev, session: data.session }));
        await fetchProfileData();
      }
    } catch (error) {
      // Error already handled in signIn
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, userData: any) => {
    return signUp(email, password, userData);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      
      setAuthState({
        profile: null,
        session: null,
        isLoading: false,
        permissions: []
      });
    } catch (error) {
      // Error already handled in signOut
      throw error;
    }
  };

  const { profile, isLoading, permissions } = authState;
  
  const isDentist = profile?.role === UserRole.DENTIST;
  const isAdmin = profile?.role === UserRole.ADMIN || profile?.role === UserRole.ADMIN_MASTER;
  const isAdminMaster = profile?.role === UserRole.ADMIN_MASTER;

  const checkPermission = (permission: UserPermission) => {
    return hasPermission(permissions, permission, isAdminMaster);
  };

  return (
    <AuthContext.Provider value={{
      profile,
      isLoading,
      session: authState.session,
      signIn: handleSignIn,
      signUp: handleSignUp,
      signOut: handleSignOut,
      refreshProfile,
      isDentist,
      isAdmin,
      isAdminMaster,
      hasPermission: checkPermission
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
