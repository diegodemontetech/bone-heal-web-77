
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "sonner";

export const useProfileData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (err) {
      console.error("Erro ao buscar dados do perfil:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error("Erro ao carregar dados do perfil");
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (updates: any) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user?.id)
        .select()
        .single();

      if (error) throw error;
      setUserData(data);
      toast.success("Perfil atualizado com sucesso!");
      return data;
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      toast.error("Erro ao atualizar perfil");
      throw err;
    }
  };

  return {
    userData,
    loading,
    error,
    fetchUserData,
    updateUserData
  };
};
