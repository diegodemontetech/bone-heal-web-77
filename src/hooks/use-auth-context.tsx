
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole, UserPermission, UserProfile } from '@/types/auth';
import { toast } from 'sonner';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isDentist: boolean;
  isAdmin: boolean;
  isAdminMaster: boolean;
  hasPermission: (permission: UserPermission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast: uiToast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<UserPermission[]>([]);

  const fetchSession = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch (error) {
      console.error("Erro ao buscar sessão:", error);
      return null;
    }
  };

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const currentSession = await fetchSession();
      setSession(currentSession);
      
      if (!currentSession) {
        setProfile(null);
        setPermissions([]);
        setIsLoading(false);
        return;
      }
      
      // Buscar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentSession.user.id)
        .single();
        
      if (profileError) throw profileError;
      
      // Buscar permissões do usuário
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('user_permissions')
        .select('permission')
        .eq('user_id', currentSession.user.id);
        
      if (permissionsError) throw permissionsError;
      
      const userPermissions = permissionsData.map(p => p.permission as UserPermission);
      
      // Montar o perfil completo
      const userProfile: UserProfile = {
        ...profileData,
        id: currentSession.user.id,
        email: currentSession.user.email || '',
        role: (profileData.role as UserRole) || UserRole.DENTIST,
        permissions: userPermissions
      };
      
      setProfile(userProfile);
      setPermissions(userPermissions);
    } catch (error: any) {
      console.error('Erro ao buscar perfil:', error);
      toast.error('Erro ao buscar perfil: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    
    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Evento de autenticação:", event, newSession?.user?.id);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(newSession);
        fetchProfile();
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setPermissions([]);
        setSession(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      if (data?.session) {
        setSession(data.session);
        await fetchProfile();
      }
    } catch (error: any) {
      toast.error("Erro ao fazer login: " + error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            role: userData.role || UserRole.DENTIST // Novo usuário sempre começa como dentista, a menos que especificado
          }
        }
      });
      
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setProfile(null);
      setSession(null);
      setPermissions([]);
      
      toast.success("Logout realizado com sucesso");
    } catch (error: any) {
      toast.error("Erro ao sair: " + error.message);
      throw error;
    }
  };

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
      session,
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
