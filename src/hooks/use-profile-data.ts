
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRole } from "@/types/auth";

export interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  neighborhood?: string;
  complemento?: string;
  endereco_numero?: string;
  cro?: string;
  specialty?: string;
  cpf?: string;
  cnpj?: string;
  role: UserRole;
  is_admin?: boolean;
  omie_sync?: boolean;
  omie_code?: string;
  // Outros campos do perfil
}

export const useProfileData = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    id: "",
    full_name: "",
    email: "",
    role: UserRole.DENTIST // Valor padrão
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (userData?.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userData.user.id)
          .single();
          
        if (profileError) throw profileError;
        
        if (profile) {
          // Converter string do role para o enum UserRole
          const userRole = profile.role as string;
          const mappedRole = Object.values(UserRole).includes(userRole as UserRole) 
            ? userRole as UserRole 
            : UserRole.DENTIST;

          setProfileData({
            ...profile,
            role: mappedRole
          });
        }
      }
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
      setError(err instanceof Error ? err : new Error("Erro ao buscar perfil"));
      toast.error("Não foi possível carregar os dados do perfil");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<ProfileData>): Promise<boolean> => {
    try {
      if (!profileData.id) {
        throw new Error("ID do perfil não encontrado");
      }
      
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profileData.id);
        
      if (error) throw error;
      
      // Atualizar o estado local
      setProfileData(prev => ({ ...prev, ...updates }));
      
      toast.success("Perfil atualizado com sucesso");
      return true;
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      toast.error("Falha ao atualizar perfil");
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
