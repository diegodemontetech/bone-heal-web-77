
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const NewsPreview = () => {
  const navigate = useNavigate();
  const { data: news, isLoading, error } = useQuery({
    queryKey: ["news-preview"],
    queryFn: async () => {
      try {
        console.log("Buscando notícias para preview...");
        const { data, error } = await supabase
          .from("news")
          .select("*")
          .order("published_at", { ascending: false })
          .limit(3);
        
        if (error) {
          console.error("Erro ao buscar notícias para preview:", error);
          // Use hardcoded news as fallback
          return getHardcodedNewsPreview();
        }
        
        if (!data || data.length === 0) {
          console.log("No news found in database, using hardcoded news preview");
          return getHardcodedNewsPreview();
        }
        
        console.log("Notícias para preview recuperadas:", data);
        return data;
      } catch (err) {
        console.error("Falha ao buscar notícias para preview:", err);
        return getHardcodedNewsPreview();
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const getHardcodedNewsPreview = () => {
    return [
      {
        id: "1",
        title: "BoneHeal é destaque no XXIV Congresso Internacional de Odontologia de São Paulo",
        slug: "boneheal-destaque-congresso-odontologia-sp",
        summary: "A BoneHeal apresentou suas soluções inovadoras em regeneração óssea guiada durante o maior evento de odontologia da América Latina.",
        featured_image: "https://im.runware.ai/image/ws/0.5/ii/0482fe5d-711d-4978-a688-af60086fe579.webp",
        published_at: "2023-01-28T14:30:00.000Z",
      },
      {
        id: "2",
        title: "Universidade Federal de São Paulo realiza curso prático com biomateriais BoneHeal",
        slug: "unifesp-curso-pratico-biomateriais-boneheal",
        summary: "Estudantes de pós-graduação em implantodontia tiveram a oportunidade de conhecer e praticar com as soluções de regeneração óssea da BoneHeal.",
        featured_image: "https://im.runware.ai/image/ws/0.5/ii/7f73e281-6c1c-48d7-a7b4-3cd88c7b0a39.webp",
        published_at: "2022-03-25T09:15:00.000Z",
      },
      {
        id: "3",
        title: "BoneHeal apresenta resultados de pesquisa no International Bone Research Symposium",
        slug: "boneheal-pesquisa-international-bone-research-symposium",
        summary: "Estudo clínico demonstra eficácia superior da tecnologia de regeneração óssea da BoneHeal em comparação com métodos convencionais.",
        featured_image: "https://im.runware.ai/image/ws/0.5/ii/3a1c0e2d-2b78-4eaa-9217-7f90fd32e1c5.webp",
        published_at: "2022-09-20T16:45:00.000Z",
      },
    ];
  };

  const handleNewsClick = (slug: string) => {
    navigate(`/news/${slug}`);
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-8">
          <div className="text-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
            <p>Carregando notícias...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error("Error in NewsPreview:", error);
    // Use hardcoded news if there's an error
    const fallbackNews = getHardcodedNewsPreview();
    
    if (fallbackNews.length > 0) {
      // Instead of showing an error, use the fallback data
      return renderNewsSection(fallbackNews);
    }
    
    return (
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-8">
          <Alert variant="destructive" className="max-w-lg mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Não foi possível carregar as notícias. Por favor, tente novamente mais tarde.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  const displayNews = news || getHardcodedNewsPreview();

  if (!displayNews || displayNews.length === 0) {
    return (
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-8">
          <div className="text-center">
            <p className="text-neutral-500">Nenhuma notícia disponível no momento.</p>
          </div>
        </div>
      </section>
    );
  }

  return renderNewsSection(displayNews);

  function renderNewsSection(newsItems: any[]) {
    return (
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary mb-4 uppercase">
              ÚLTIMAS NOTÍCIAS
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Fique por dentro das novidades e atualizações
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {newsItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                onClick={() => handleNewsClick(item.slug)}
                className="cursor-pointer"
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={item.featured_image || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80"}
                      alt={item.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80";
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-neutral-500 mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(item.published_at), "d 'de' MMMM, yyyy", { locale: ptBR })}
                    </div>
                    <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors uppercase">
                      {item.title}
                    </h3>
                    <p className="text-neutral-600 mb-4 line-clamp-2">
                      {item.summary}
                    </p>
                    <span className="inline-flex items-center text-primary hover:text-primary-dark transition-colors uppercase font-semibold">
                      LER MAIS
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/news')}
              className="inline-flex items-center justify-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors font-semibold uppercase"
            >
              VER TODAS AS NOTÍCIAS
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    );
  }
};

export default NewsPreview;
