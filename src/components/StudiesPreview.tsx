
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Download, Calendar, AlertCircle, Loader2, FileText, Book, Link2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Badge } from "@/components/ui/badge";
import { ScientificStudy } from "@/types/scientific-study";

const StudiesPreview = () => {
  const [language, setLanguage] = useState<"pt" | "en" | "es">("pt");
  
  const { data: studies, isLoading, error } = useQuery({
    queryKey: ["studies-preview"],
    queryFn: async () => {
      try {
        console.log("Buscando estudos para preview...");
        const { data, error } = await supabase
          .from("scientific_studies")
          .select("*")
          .order("published_date", { ascending: false })
          .limit(3);
        
        if (error) {
          console.error("Erro ao buscar estudos para preview:", error);
          throw error;
        }
        
        console.log("Estudos para preview recuperados:", data);
        return data as ScientificStudy[];
      } catch (error) {
        console.error("Falha ao buscar estudos para preview:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  });

  const titles = {
    pt: "Estudos Científicos",
    en: "Scientific Studies",
    es: "Estudios Científicos"
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

  const buttonTexts = {
    pt: "Ver todos os estudos",
    en: "View all studies",
    es: "Ver todos los estudios"
  };

  const viewDetailsTexts = {
    pt: "Ver detalhes",
    en: "View details",
    es: "Ver detalles"
  };

  const pdfTexts = {
    pt: "Baixar PDF",
    en: "Download PDF",
    es: "Descargar PDF"
  };

  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case "clinical-case":
        return language === "pt" ? "Caso Clínico" : 
               language === "en" ? "Clinical Case" : "Caso Clínico";
      case "systematic-review":
        return language === "pt" ? "Revisão Sistemática" : 
               language === "en" ? "Systematic Review" : "Revisión Sistemática";
      case "randomized-trial":
        return language === "pt" ? "Ensaio Clínico" : 
               language === "en" ? "Clinical Trial" : "Ensayo Clínico";
      case "laboratory-study":
        return language === "pt" ? "Estudo Laboratorial" : 
               language === "en" ? "Laboratory Study" : "Estudio de Laboratorio";
      default:
        return language === "pt" ? "Outro" : 
               language === "en" ? "Other" : "Otro";
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "clinical-case":
        return "bg-blue-100 text-blue-800";
      case "systematic-review":
        return "bg-purple-100 text-purple-800";
      case "randomized-trial":
        return "bg-green-100 text-green-800";
      case "laboratory-study":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-8">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher 
            language={language}
            onLanguageChange={setLanguage}
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <h2 className="text-4xl font-bold text-primary mb-4">
              <span className="mr-2">Bone Heal</span>
              <sup className="text-sm align-super">®</sup>
            </h2>
          </div>
          <h3 className="text-4xl font-bold text-primary mb-4">
            {titles[language]}
          </h3>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            {subtitles[language]}
          </p>
        </motion.div>

        {error && (
          <Alert variant="destructive" className="mb-6 max-w-lg mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Não foi possível carregar os estudos científicos. Por favor, tente novamente mais tarde.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
            <span>Carregando estudos...</span>
          </div>
        ) : studies && studies.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {studies.map((study) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl border border-neutral-200"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-neutral-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(study.published_date), "d 'de' MMMM, yyyy", { locale: ptBR })}
                    </div>
                    
                    {study.category && (
                      <Badge className={getCategoryColor(study.category)}>
                        {getCategoryLabel(study.category)}
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{study.title}</h3>
                  
                  <p className="text-sm text-neutral-600 mb-2 font-medium">
                    {study.authors}
                  </p>
                  
                  <p className="text-sm text-neutral-500 mb-3 italic">
                    {study.journal}, {study.year}
                  </p>
                  
                  <p className="text-neutral-600 mb-6 line-clamp-3">
                    {study.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                    <Button
                      variant="link"
                      className="p-0 h-auto font-normal text-primary hover:text-primary-dark transition-colors flex items-center"
                      asChild
                    >
                      <Link to="/studies">
                        {viewDetailsTexts[language]}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    
                    <div className="flex space-x-3">
                      {study.file_url && (
                        <a
                          href={study.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      
                      {study.url && (
                        <a
                          href={study.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
                          title="Link externo"
                        >
                          <Link2 className="w-4 h-4" />
                        </a>
                      )}
                      
                      {study.doi && (
                        <a
                          href={`https://doi.org/${study.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
                          title="DOI"
                        >
                          <Book className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-500">{emptyMessages[language]}</p>
          </div>
        )}

        <div className="text-center">
          <Link
            to="/studies"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-semibold"
          >
            {buttonTexts[language]}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StudiesPreview;
