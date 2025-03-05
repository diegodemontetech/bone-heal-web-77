
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole, UserPermission, UserProfile } from '@/types/auth';

interface AuthContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<any>; // Alterada para retornar os dados do signup
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isDentist: boolean;
  isAdmin: boolean;
  isAdminMaster: boolean;
  hasPermission: (permission: UserPermission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<UserPermission[]>([]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setProfile(null);
        setPermissions([]);
        setIsLoading(false);
        return;
      }
      
      // Buscar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profileError) throw profileError;
      
      // Buscar permissões do usuário
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('user_permissions')
        .select('permission')
        .eq('user_id', session.user.id);
        
      if (permissionsError) throw permissionsError;
      
      const userPermissions = permissionsData.map(p => p.permission as UserPermission);
      
      // Montar o perfil completo
      const userProfile: UserProfile = {
        ...profileData,
        id: session.user.id,
        email: session.user.email || '',
        role: (profileData.role as UserRole) || UserRole.DENTIST,
        permissions: userPermissions
      };
      
      setProfile(userProfile);
      setPermissions(userPermissions);
    } catch (error: any) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    
    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchProfile();
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setPermissions([]);
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message,
        variant: "destructive",
      });
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
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu e-mail para confirmar o cadastro.",
      });

      // Retornando os dados para que possamos utilizar o ID do usuário para integrações
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
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
