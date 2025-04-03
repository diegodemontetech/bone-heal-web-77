
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

export const useUserZipCode = () => {
  const [zipCode, setZipCode] = useState<string>("");
  const [zipCodeFetched, setZipCodeFetched] = useState<boolean>(false);
  const session = useSession();

  // Função para buscar o CEP do usuário
  const loadUserZipCode = async () => {
    if (!session?.user?.id) {
      console.log("Não há sessão ativa para buscar CEP");
      return null;
    }
    
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
      
      if (profile?.zip_code && profile.zip_code.length >= 8) {
        const cleanZipCode = profile.zip_code.replace(/\D/g, '');
        console.log("CEP encontrado no perfil:", cleanZipCode);
        setZipCode(cleanZipCode);
        return cleanZipCode;
      }
      
      console.log("Nenhum CEP válido encontrado no perfil");
      return null;
    } catch (error) {
      console.error('Erro inesperado ao buscar CEP:', error);
      return null;
    }
  };

  // Efeito para carregar o CEP do usuário quando o componente monta
  useEffect(() => {
    if (session?.user?.id && !zipCodeFetched) {
      loadUserZipCode();
    }
  }, [session?.user?.id, zipCodeFetched]);

  return {
    zipCode, 
    setZipCode, 
    zipCodeFetched,
    loadUserZipCode
  };
};
