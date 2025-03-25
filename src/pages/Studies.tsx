
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, Download, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const Studies = () => {
  const [language, setLanguage] = useState<"pt" | "en" | "es">("pt");

  const { data: studies, isLoading, error } = useQuery({
    queryKey: ["studies-full"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("scientific_studies")
          .select("*")
          .order("published_date", { ascending: false });
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Erro ao buscar estudos:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const titles = {
    pt: "Estudos científicos",
    en: "Scientific Studies",
    es: "Estudios científicos"
  };

  const subtitles = {
    pt: "Descubra as evidências científicas que comprovam nossa eficácia",
    en: "Discover the scientific evidence that proves our effectiveness",
    es: "Descubra las evidencias científicas que comprueban nuestra eficacia"
  };

  const emptyMessages = {
    pt: "Nenhum estudo científico disponível no momento.",
    en: "No scientific studies available at the moment.",
    es: "Ningún estudio científico disponible en este momento."
  };

  const viewDetailsTexts = {
    pt: "Ver detalhes",
    en: "View details",
    es: "Ver detalles"
  };

  const pdfTexts = {
    pt: "PDF indisponível",
    en: "PDF unavailable",
    es: "PDF no disponible"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{titles[language]} | BoneHeal</title>
        <meta name="description" content={subtitles[language]} />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-1 py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">{titles[language]}</h1>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => setLanguage("pt")}
                className={`flex items-center ${language === "pt" ? "ring-2 ring-primary" : ""} rounded-full overflow-hidden`}
                title="Português"
              >
                <img src="https://flagcdn.com/br.svg" alt="Português" className="w-6 h-6 object-cover" />
              </button>
              <button 
                onClick={() => setLanguage("en")}
                className={`flex items-center ${language === "en" ? "ring-2 ring-primary" : ""} rounded-full overflow-hidden`}
                title="English"
              >
                <img src="https://flagcdn.com/gb.svg" alt="English" className="w-6 h-6 object-cover" />
              </button>
              <button 
                onClick={() => setLanguage("es")}
                className={`flex items-center ${language === "es" ? "ring-2 ring-primary" : ""} rounded-full overflow-hidden`}
                title="Español"
              >
                <img src="https://flagcdn.com/es.svg" alt="Español" className="w-6 h-6 object-cover" />
              </button>
            </div>
          </div>

          <p className="text-lg text-gray-600 mb-10 max-w-3xl">
            {subtitles[language]}
          </p>

          {error && (
            <Alert variant="destructive" className="mb-6 max-w-3xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                Não foi possível carregar os estudos científicos. Por favor, tente novamente mais tarde.
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-primary mr-3" />
              <span className="text-lg">Carregando estudos...</span>
            </div>
          ) : studies && studies.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studies.map((study) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-neutral-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center text-sm text-neutral-500 mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(study.published_date), "d 'de' MMMM, yyyy", { locale: ptBR })}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{study.title}</h3>
                    <p className="text-neutral-600 mb-6 line-clamp-4">
                      {study.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      {study.file_url ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-primary text-primary hover:bg-primary/5"
                          asChild
                        >
                          <a href={study.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" />
                            PDF
                          </a>
                        </Button>
                      ) : (
                        <span className="text-neutral-400 text-sm">{pdfTexts[language]}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <p className="text-neutral-500 text-lg">{emptyMessages[language]}</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Studies;
