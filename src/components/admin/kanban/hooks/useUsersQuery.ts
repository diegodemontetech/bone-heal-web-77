
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  full_name: string;
  email: string;
}

export const useUsersQuery = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users-kanban"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .eq("is_admin", true)
          .order("full_name", { ascending: true });

        if (error) {
          console.error("Erro ao buscar usuários:", error);
          throw new Error("Não foi possível carregar os usuários");
        }

        return data as User[];
      } catch (err) {
        console.error("Erro na consulta de usuários:", err);
        throw err;
      }
    }
  });

  return {
    users: data,
    isLoading,
    error
  };
};
