
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { NewsHero } from "@/components/NewsHero";
import { NewsCategories } from "@/components/NewsCategories";
import { NewsList } from "@/components/NewsList";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: news, isLoading, error } = useQuery({
    queryKey: ["news", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false });

      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["news-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("category")
        .not("category", "is", null);
      
      if (error) throw error;
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(item => item.category))].filter(Boolean);
      return uniqueCategories;
    },
  });

  return (
    <>
      <Helmet>
        <title>Notícias | Boneheal</title>
        <meta name="description" content="Fique por dentro das novidades do setor odontológico e as últimas atualizações da Boneheal." />
      </Helmet>

      <NewsHero />

      {categories && categories.length > 0 && (
        <NewsCategories 
          categories={categories} 
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
      )}

      {error && (
        <div className="container mx-auto py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Não foi possível carregar as notícias. Por favor, tente novamente mais tarde.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {isLoading ? (
        <div className="container mx-auto py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <NewsList news={news || []} />
      )}
    </>
  );
};

export default News;
