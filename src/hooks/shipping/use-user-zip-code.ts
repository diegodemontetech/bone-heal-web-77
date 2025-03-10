
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export const useUserZipCode = () => {
  const [zipCode, setZipCode] = useState("");
  const [zipCodeFetched, setZipCodeFetched] = useState(false);
  const session = useSession();

  // Função para buscar o CEP do usuário
  const fetchUserZipCode = async () => {
    if (!session?.user?.id || zipCodeFetched) return null;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('zip_code')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error('Erro ao buscar CEP do usuário:', error);
        return null;
      }
      
      // Marcar que já buscamos o CEP para evitar buscas repetidas
      setZipCodeFetched(true);
      
      if (profile?.zip_code && profile.zip_code.length === 8) {
        return profile.zip_code;
      }
      
      return null;
    } catch (error) {
      console.error('Erro inesperado ao buscar CEP:', error);
      return null;
    }
  };

  // Efeito para carregar o CEP do usuário - executado apenas uma vez quando o componente monta
  useEffect(() => {
    const loadUserShipping = async () => {
      // Se já carregamos o CEP, não precisamos carregar novamente
      if (zipCodeFetched || !session?.user?.id) {
        return;
      }
      
      const userZipCode = await fetchUserZipCode();
      
      if (userZipCode && userZipCode.length === 8) {
        console.log("CEP do usuário carregado:", userZipCode);
        setZipCode(userZipCode);
      }
    };

    loadUserShipping();
  }, [session?.user?.id, zipCodeFetched]);

  return {
    zipCode,
    setZipCode,
    zipCodeFetched
  };
};
