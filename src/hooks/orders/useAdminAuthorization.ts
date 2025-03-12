
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useAdminAuthorization = (onUnauthorized?: () => void) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      toast.error("Você não tem permissão para acessar esta página");
      onUnauthorized?.();
    }
  }, [isAdmin, onUnauthorized]);

  const verifyAdminPermission = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast.error("Você precisa estar autenticado");
        return false;
      }
      
      const { data: profileData } = await supabase
        .from("profiles")
        .select("is_admin, role")
        .eq("id", session.session.user.id)
        .single();
        
      const hasAdminPermission = 
        profileData?.is_admin === true || 
        profileData?.role === 'admin' || 
        profileData?.role === 'admin_master';
        
      if (!hasAdminPermission) {
        toast.error("Você não tem permissão para esta ação");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro ao verificar permissões:", error);
      toast.error("Erro ao verificar permissões");
      return false;
    }
  };

  return {
    isAdmin,
    verifyAdminPermission
  };
};
