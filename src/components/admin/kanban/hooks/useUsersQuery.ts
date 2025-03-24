
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUsersQuery = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .eq("is_admin", true);
        
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },
  });

  return { users: users || [], isLoading, error };
};
