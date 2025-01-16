import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

const NewsCategories = () => {
  const { toast } = useToast();
  
  const { data: categories, error } = useQuery({
    queryKey: ["newsCategories"],
    queryFn: async () => {
      console.log("Fetching news categories...");
      const { data, error } = await supabase
        .from("news_categories")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching categories:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar categorias",
          description: error.message,
        });
        throw error;
      }
      
      console.log("Categories data:", data);
      return data as Category[];
    },
  });

  if (error) {
    return (
      <div className="text-red-600 mb-4">
        Erro ao carregar categorias
      </div>
    );
  }

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