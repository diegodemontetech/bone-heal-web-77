import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  featured_image: string;
  published_at: string;
  category: string;
  views: number;
}

const NewsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: news, isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      console.log("Fetching news...");
      try {
        const { data, error: supabaseError } = await supabase
          .from("news")
          .select("*")
          .order("published_at", { ascending: false });
        
        if (supabaseError) {
          console.error("Error fetching news:", supabaseError);
          toast({
            variant: "destructive",
            title: "Erro ao carregar notícias",
            description: supabaseError.message,
          });
          throw supabaseError;
        }
        
        console.log("News data:", data);
        return data as NewsItem[];
      } catch (err) {
        console.error("Error in news query:", err);
        throw err;
      }
    },
    retry: 1,
  });

  const handleNewsClick = (slug: string) => {
    navigate(`/news/${slug}`);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-red-600">
          Erro ao carregar notícias. Por favor, tente novamente mais tarde.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
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
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-neutral-600">
          Nenhuma notícia encontrada.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => handleNewsClick(item.slug)}
            className="cursor-pointer"
          >
            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={item.featured_image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                <p className="text-neutral-600 mb-4 line-clamp-2">{item.summary}</p>
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    {format(new Date(item.published_at), "d 'de' MMMM, yyyy", { locale: ptBR })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {item.views}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NewsList;