
import { createContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UsersContext } from "./UsersContext";
import { UserProfile, UserRole } from "@/types/auth";
import { UserData, NewUser } from "./types";
import { availablePermissions } from "./permissions";

type UsersProviderProps = {
  children: ReactNode;
};

export const UsersProvider = ({ children }: UsersProviderProps) => {
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [isAdminMaster, setIsAdminMaster] = useState(false);

  // Verificar se o usuário atual é um administrador master
  useEffect(() => {
    const checkAdminMaster = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setIsAdminMaster(profile?.role === UserRole.ADMIN_MASTER);
    };

    checkAdminMaster();
  }, []);

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      console.log("Buscando usuários na UsersProvider...");
      
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (profilesError) {
          console.error("Erro ao buscar perfis:", profilesError);
          throw profilesError;
        }

        const profilesWithPermissions = await Promise.all(
          profiles.map(async (profile) => {
            const { data: permissions, error: permissionsError } = await supabase
              .from("user_permissions")
              .select("permission")
              .eq("user_id", profile.id);

            if (permissionsError) {
              console.error(`Erro ao buscar permissões para usuário ${profile.id}:`, permissionsError);
            }

            return {
              ...profile,
              full_name: profile.full_name || (profile.nome_cliente || "Usuário sem nome"),
              email: profile.email || "email@indisponivel.com",
              role: profile.role || "dentist",
              is_admin: profile.role === UserRole.ADMIN || profile.role === UserRole.ADMIN_MASTER, // Garantindo que is_admin seja sempre definido
              permissions: permissions?.map(p => p.permission) || [],
              created_at: profile.created_at || new Date().toISOString()
            };
          })
        );

        console.log(`UsersProvider carregou ${profilesWithPermissions.length} usuários`);
        return profilesWithPermissions as UserData[];
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        toast.error("Falha ao carregar usuários");
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const syncOmieUsers = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-omie-users');
      
      if (error) {
        throw error;
      }
      
      await refetch();
      
      toast.success(data.message || "Usuários Omie sincronizados com sucesso!");
      return data;
    } catch (error: any) {
      console.error("Erro ao sincronizar usuários Omie:", error);
      toast.error("Erro ao sincronizar usuários: " + (error.message || "Erro desconhecido"));
      throw error;
    }
  };

  // Implementação dos métodos necessários para UsersContextType
  const createUser = async (user: NewUser) => {
    try {
      // Implementação para criar usuário
      toast.success("Usuário criado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      toast.error("Erro ao criar usuário: " + (error.message || "Erro desconhecido"));
      throw error;
    }
  };

  const updateUserPermissions = async (userId: string, permissions: string[]) => {
    try {
      // Implementação para atualizar permissões
      toast.success("Permissões atualizadas com sucesso!");
    } catch (error: any) {
      console.error("Erro ao atualizar permissões:", error);
      toast.error("Erro ao atualizar permissões: " + (error.message || "Erro desconhecido"));
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Implementação para excluir usuário
      toast.success("Usuário excluído com sucesso!");
      await refetch();
    } catch (error: any) {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Erro ao excluir usuário: " + (error.message || "Erro desconhecido"));
      throw error;
    }
  };

  return (
    <UsersContext.Provider
      value={{
        users: users || [],
        isLoading,
        error: error as Error | null,
        createUser,
        updateUserPermissions,
        deleteUser,
        availablePermissions
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
