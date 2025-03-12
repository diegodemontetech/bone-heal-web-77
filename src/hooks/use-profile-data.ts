
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "sonner";

export interface ProfileData extends UserProfile {}

export const useProfileData = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { session } = useAuth();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!session?.user.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;
        setProfileData(data);
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
        setError(err instanceof Error ? err : new Error("Erro desconhecido"));
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [session]);

  const updateProfile = async (updates: Partial<ProfileData>): Promise<boolean> => {
    if (!session?.user.id) return false;

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", session.user.id);

      if (error) throw error;

      setProfileData(prev => prev ? { ...prev, ...updates } : null);
      toast.success("Perfil atualizado com sucesso");
      return true;
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      toast.error("Erro ao atualizar perfil");
      return false;
    }
  };

  return {
    profileData,
    loading,
    error,
    updateProfile
  };
};
