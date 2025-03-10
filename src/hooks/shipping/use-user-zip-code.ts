
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export const useUserZipCode = () => {
  const [zipCode, setZipCode] = useState("");
  const [zipCodeFetched, setZipCodeFetched] = useState(false);
  const session = useSession();

  // Função para buscar o CEP do usuário
  const fetchUserZipCode = async () => {
    if (!session?.user?.id) {
      console.log("Sem usuário autenticado para buscar CEP");
      
      // Verificar diretamente a sessão para casos em que o hook useSession não funciona
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user?.id) {
        console.log("Nenhuma sessão encontrada, impossível buscar CEP");
        return null;
      }
      
      const userId = sessionData.session.user.id;
      console.log("Usando ID de usuário da sessão direta:", userId);
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('zip_code')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error('Erro ao buscar CEP do usuário (sessão direta):', error);
          return null;
        }
        
        setZipCodeFetched(true);
        
        if (profile?.zip_code && profile.zip_code.length === 8) {
          console.log("CEP encontrado (sessão direta):", profile.zip_code);
          return profile.zip_code;
        }
        
        return null;
      } catch (error) {
        console.error('Erro inesperado ao buscar CEP (sessão direta):', error);
        return null;
      }
    }
    
    try {
      console.log("Buscando CEP para usuário:", session.user.id);
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
        console.log("CEP encontrado:", profile.zip_code);
        return profile.zip_code;
      }
      
      return null;
    } catch (error) {
      console.error('Erro inesperado ao buscar CEP:', error);
      return null;
    }
  };

  // Efeito para carregar o CEP do usuário - executado quando o usuário estiver autenticado
  useEffect(() => {
    const loadUserShipping = async () => {
      // Se já carregamos o CEP, não precisamos carregar novamente
      if (zipCodeFetched) {
        console.log("CEP já foi buscado anteriormente, ignorando");
        return;
      }
      
      const userZipCode = await fetchUserZipCode();
      
      if (userZipCode && userZipCode.length === 8) {
        console.log("CEP do usuário carregado com sucesso:", userZipCode);
        setZipCode(userZipCode);
      } else {
        console.log("Nenhum CEP válido encontrado para o usuário");
      }
    };

    // Tentar carregar o CEP do usuário sempre que a sessão mudar
    loadUserShipping();
  }, [session?.user?.id, zipCodeFetched]);

  return {
    zipCode,
    setZipCode,
    zipCodeFetched
  };
};
