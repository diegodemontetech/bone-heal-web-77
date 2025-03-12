
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLeadsQuery = (filter: string | null) => {
  const { data: leads, isLoading, refetch } = useQuery({
    queryKey: ["leads", filter],
    queryFn: async () => {
      let query = supabase
        .from("contact_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter) {
        query = query.eq("source", filter);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching leads:", error);
        throw error;
      }
      
      return data;
    },
  });

  return { leads, isLoading, refetch };
};
