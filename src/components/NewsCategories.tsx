import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Category {
  id: string;  // Changed from number to string
  name: string;
  slug: string;
  description: string;
}

const NewsCategories = () => {
  const { data: categories } = useQuery({
    queryKey: ["newsCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Category[];
    },
  });

  return (
    <aside className="w-full lg:w-64 mb-8 lg:mb-0">
      <h2 className="text-xl font-bold mb-4">Categorias</h2>
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            Todas as Notícias
          </Button>
          {categories?.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className="w-full justify-start"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default NewsCategories;