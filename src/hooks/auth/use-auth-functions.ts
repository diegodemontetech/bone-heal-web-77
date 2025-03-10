
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { signInWithEmail, signUpWithEmail, signOutUser } from './auth-service';
import { toast } from 'sonner';

export function useAuthFunctions() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) throw error;
      
      return { data };
    } catch (error: any) {
      toast.error("Erro ao fazer login: " + error.message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await signUpWithEmail(email, password, userData);
      
      if (error) throw error;
      
      toast.success("Cadastro realizado com sucesso! Verifique seu e-mail para confirmar o cadastro.");

      // Retornando os dados para que possamos utilizar o ID do usuário para integrações
      return data;
    } catch (error: any) {
      toast.error("Erro ao cadastrar: " + error.message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const signOut = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await signOutUser();
      if (error) throw error;
      
      toast.success("Logout realizado com sucesso");
    } catch (error: any) {
      toast.error("Erro ao sair: " + error.message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    isSubmitting
  };
}
