import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "./types";

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar usuários:", error);
        throw new Error("Não foi possível carregar os usuários");
      }

      const users: UserData[] = data.map((user) => ({
        id: user.id,
        email: user.email || "",
        full_name: user.full_name || "Usuário sem nome",
        role: user.role as any,
        is_admin: user.is_admin || false,
        created_at: user.created_at,
        permissions: [],
        omie_code: user.omie_code,
        omie_sync: user.omie_sync,
      }));

      return users;
    },
    retry: 1,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
