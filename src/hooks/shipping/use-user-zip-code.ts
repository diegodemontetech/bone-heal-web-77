
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUserZipCode = () => {
  const [zipCode, setZipCode] = useState<string>("");
  const [zipCodeFetched, setZipCodeFetched] = useState<boolean>(false);
  const fetchAttemptedRef = useRef(false);

  // Load user's zipcode from profile only once
  const loadUserZipCode = async () => {
    // If already fetched or attempted, don't try again
    if (zipCodeFetched || fetchAttemptedRef.current) {
      return;
    }
    
    fetchAttemptedRef.current = true;
    
    try {
      // Check if we have a session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        console.log("Sem sessão de usuário para carregar CEP");
        return;
      }
      
      const userId = sessionData.session.user.id;
      
      // Fetch profile data
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("zip_code")
        .eq("id", userId)
        .single();
        
      if (error) {
        console.error("Erro ao buscar CEP do usuário:", error);
        return;
      }
      
      if (profile && profile.zip_code) {
        // Remove non-numeric characters
        const cleanZipCode = profile.zip_code.replace(/\D/g, "");
        setZipCode(cleanZipCode);
        setZipCodeFetched(true);
      }
    } catch (error) {
      console.error("Erro ao carregar CEP do usuário:", error);
    }
  };

  return {
    zipCode,
    setZipCode,
    zipCodeFetched,
    loadUserZipCode
  };
};
