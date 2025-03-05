
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Eye, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface NewsListProps {
  news?: any[];
}

const NewsList = ({ news: initialNews }: NewsListProps) => {
  const navigate = useNavigate();
  
  const { data: news, isLoading, error, refetch } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      try {
        console.log("Fetching news...");
        const { data, error } = await supabase
          .from("news")
          .select("*")
          .order("published_at", { ascending: false });
        
        if (error) {
          console.error("Error fetching news:", error);
          throw error;
        }

        console.log("News data:", data);
        return data || [];
      } catch (err) {
        console.error("Failed to fetch news:", err);
        throw err;
      }
    },
    initialData: initialNews,
    enabled: !initialNews || initialNews.length === 0,
    retry: 1,
    meta: {
      errorMessage: "Erro ao carregar notícias"
    },
  });

  if (error) {
    toast.error("Erro ao carregar notícias", {
      description: "Por favor, tente novamente mais tarde."
    });
    
    return (
      <div className="text-center p-8">
        <div className="text-red-600 font-semibold mb-4">
          Erro ao carregar notícias
        </div>
        <Button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar Novamente
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-neutral-200 rounded-t-lg" />
            <CardContent className="p-6">
              <div className="h-6 bg-neutral-200 rounded mb-4" />
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const displayNews = news || [];
  
  if (displayNews.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-neutral-600 mb-4">
          Nenhuma notícia encontrada
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {displayNews.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onClick={() => navigate(`/news/${item.slug}`)}
          className="cursor-pointer"
        >
          <Card className="group hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <img
                src={item.featured_image || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              {item.category && (
                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
                  {item.category}
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-neutral-600 mb-4 line-clamp-2">
                {item.summary}
              </p>
              <div className="flex items-center justify-between text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  {format(new Date(item.published_at), "d 'de' MMMM, yyyy", { locale: ptBR })}
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {item.views || 0}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default NewsList;
