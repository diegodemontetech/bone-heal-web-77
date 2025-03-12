
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserData, NewUser, UsersContextType } from "./types";
import { UserRole } from "@/types/auth";
import { useAuth } from "@/hooks/use-auth-context";

interface UsersProviderProps {
  children: React.ReactNode;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<UsersProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { profile } = useAuth();

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar usuários:", error);
        setError(error);
        toast.error("Erro ao buscar usuários. Consulte o console para mais detalhes.");
      }

      if (data) {
        const usersData = data.map(user => {
          const fullName = user.full_name || "Usuário sem nome";
          return {
            id: user.id,
            email: user.email || "Email não disponível",
            full_name: fullName,
            role: (user.role || "user") as UserRole,
            is_admin: user.is_admin || false,
            created_at: user.created_at,
            permissions: [],
            omie_code: user.omie_code,
            omie_sync: user.omie_sync
          };
        });
        setUsers(usersData);
      }
    } catch (err: any) {
      console.error("Erro inesperado ao buscar usuários:", err);
      setError(err);
      toast.error("Erro inesperado ao buscar usuários. Consulte o console para mais detalhes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (user: NewUser) => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            full_name: user.full_name,
            role: user.role,
            is_admin: user.role === 'admin' || user.role === 'manager',
          },
        },
      });

      if (authError) {
        console.error("Erro ao criar usuário:", authError);
        toast.error(`Erro ao criar usuário: ${authError.message}`);
        return;
      }

      if (authData.user?.id) {
        // Atualizar as permissões do usuário
        await updateUserPermissions(authData.user.id, user.permissions);
      }

      toast.success("Usuário criado com sucesso!");
      fetchUsers(); // Recarrega a lista de usuários
    } catch (err: any) {
      console.error("Erro ao criar usuário:", err);
      toast.error(`Erro ao criar usuário: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPermissions = async (userId: string, permissions: string[]) => {
    setIsLoading(true);
    try {
      // Remover todas as permissões existentes do usuário
      const { error: deleteError } = await supabase
        .from("user_permissions")
        .delete()
        .eq("user_id", userId);

      if (deleteError) {
        console.error("Erro ao remover permissões antigas:", deleteError);
        toast.error("Erro ao remover permissões antigas.");
        return;
      }

      // Adicionar as novas permissões
      const newPermissions = permissions.map(permission => ({
        user_id: userId,
        permission: permission,
      }));

      const { error: insertError } = await supabase
        .from("user_permissions")
        .insert(newPermissions);

      if (insertError) {
        console.error("Erro ao adicionar novas permissões:", insertError);
        toast.error("Erro ao adicionar novas permissões.");
        return;
      }

      toast.success("Permissões do usuário atualizadas com sucesso!");
      fetchUsers(); // Recarrega a lista de usuários
    } catch (err: any) {
      console.error("Erro ao atualizar permissões do usuário:", err);
      toast.error(`Erro ao atualizar permissões do usuário: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    setIsLoading(true);
    try {
      // Excluir o usuário da autenticação (se necessário)
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) {
        console.error("Erro ao excluir usuário da autenticação:", authError);
        toast.error("Erro ao excluir usuário da autenticação.");
        return;
      }

      // Excluir o perfil do usuário
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (profileError) {
        console.error("Erro ao excluir perfil do usuário:", profileError);
        toast.error("Erro ao excluir perfil do usuário.");
        return;
      }

      toast.success("Usuário excluído com sucesso!");
      fetchUsers(); // Recarrega a lista de usuários
    } catch (err: any) {
      console.error("Erro ao excluir usuário:", err);
      toast.error(`Erro ao excluir usuário: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const availablePermissions = [
    { id: "read:products", label: "Ler Produtos" },
    { id: "create:products", label: "Criar Produtos" },
    { id: "update:products", label: "Atualizar Produtos" },
    { id: "delete:products", label: "Excluir Produtos" },
    { id: "read:users", label: "Ler Usuários" },
    { id: "create:users", label: "Criar Usuários" },
    { id: "update:users", label: "Atualizar Usuários" },
    { id: "delete:users", label: "Excluir Usuários" },
    // Adicione mais permissões conforme necessário
  ];

  const value: UsersContextType = {
    users,
    isLoading,
    error,
    createUser,
    updateUserPermissions,
    deleteUser,
    availablePermissions,
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsers deve ser usado dentro de um UsersProvider");
  }
  return context;
};
