import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Eye, Tag, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: news, isLoading } = useQuery({
    queryKey: ["news", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;

      // Incrementar o contador de visualizações
      await supabase
        .from("news")
        .update({ views: (data.views || 0) + 1 })
        .eq("id", data.id);

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-neutral-200 rounded w-1/2 mb-8" />
            <div className="aspect-video bg-neutral-200 rounded mb-8" />
            <div className="space-y-4">
              <div className="h-4 bg-neutral-200 rounded w-full" />
              <div className="h-4 bg-neutral-200 rounded w-5/6" />
              <div className="h-4 bg-neutral-200 rounded w-4/6" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Notícia não encontrada</h1>
            <p className="text-neutral-600 mb-8">
              A notícia que você está procurando não existe ou foi removida.
            </p>
            <Link to="/news">
              <Button>Voltar para Notícias</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="relative h-[60vh] bg-black">
          <img
            src={news.featured_image}
            alt={news.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 text-white p-8">
            <div className="container mx-auto">
              <Link
                to="/news"
                className="inline-flex items-center text-white/80 hover:text-white mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Notícias
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{news.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  {format(new Date(news.published_at), "d 'de' MMMM, yyyy", {
                    locale: ptBR,
                  })}
                </div>
                {news.author && (
                  <div className="flex items-center gap-2">
                    <span>Por {news.author}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {news.views} visualizações
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {news.category && (
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 text-sm text-primary">
                  <Tag className="w-4 h-4" />
                  {news.category}
                </span>
              </div>
            )}
            
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: news.content }} />
            </div>

            {news.tags && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {news.tags.split(",").map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-neutral-100 rounded-full text-sm"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewsDetail;