
import { createContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UsersContext } from "./UsersContext";
import { User, UserRole } from "@/types/auth";

type UsersProviderProps = {
  children: ReactNode;
};

export const UsersProvider = ({ children }: UsersProviderProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
              permissions: permissions?.map(p => p.permission) || [],
              created_at: profile.created_at || new Date().toISOString()
            };
          })
        );

        console.log(`UsersProvider carregou ${profilesWithPermissions.length} usuários`);
        return profilesWithPermissions;
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

  return (
    <UsersContext.Provider
      value={{
        users: users || [],
        isLoading,
        error: error as Error | null,
        selectedUser,
        setSelectedUser,
        isDeleteUserDialogOpen,
        setIsDeleteUserDialogOpen,
        isEditUserDialogOpen,
        setIsEditUserDialogOpen,
        isCreateUserDialogOpen,
        setIsCreateUserDialogOpen,
        refetchUsers: refetch,
        isAdminMaster,
        syncOmieUsers
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
