
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";

interface Profile {
  id: string;
  is_admin: boolean;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    console.log('Fetching profile for user:', userId);
    if (!userId) return null;

    try {
      // Nota: Mudamos de uma consulta à tabela profiles para uma função RPC mais segura
      // que evita problemas de recursão infinita nas políticas RLS
      const { data, error } = await supabase
        .rpc('get_user_profile_by_id', { user_id: userId });

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      console.log('Fetched profile:', data);
      return data;
    } catch (error) {
      console.error("Exception fetching profile:", error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          const profile = await fetchProfile(session.user.id);
          setAuthState({
            user: session.user,
            session,
            profile,
            loading: false,
          });
          
          // Check if this is admin@example.com for testing
          const isDefaultAdmin = session.user.email === 'boneheal.ti@gmail.com';
          
          if (isDefaultAdmin || profile?.is_admin) {
            console.log('User is admin, setting profile.is_admin to true');
            setAuthState(prev => ({
              ...prev,
              profile: { ...prev.profile, is_admin: true } as Profile
            }));
          }
        } else if (mounted) {
          setAuthState({
            user: null,
            session: null,
            profile: null,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Error in initializeAuth:", error);
        if (mounted) {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        
        if (session?.user && mounted) {
          const profile = await fetchProfile(session.user.id);
          
          // Check if this is admin@example.com for testing
          const isDefaultAdmin = session.user.email === 'boneheal.ti@gmail.com';
          
          setAuthState({
            user: session.user,
            session,
            profile: isDefaultAdmin ? { ...profile, is_admin: true } as Profile : profile,
            loading: false,
          });
        } else if (mounted) {
          setAuthState({
            user: null,
            session: null,
            profile: null,
            loading: false,
          });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error("Usuário não encontrado");
      }

      // Especial para o usuário admin predefinido
      const isDefaultAdmin = email === 'boneheal.ti@gmail.com';
      
      if (isDefaultAdmin) {
        console.log('Admin user logged in, redirecting to admin panel');
        navigate("/admin");
        toast({
          title: "Login admin realizado com sucesso",
          description: "Bem-vindo ao painel administrativo!",
        });
        return;
      }
      
      const profile = await fetchProfile(data.user.id);

      if (profile?.is_admin) {
        navigate("/admin");
      } else {
        navigate("/");
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Falha ao fazer login";
      
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Email ou senha inválidos";
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    ...authState,
    signIn,
    signOut,
    isAdmin: authState.profile?.is_admin || authState.user?.email === 'boneheal.ti@gmail.com',
  };
}
