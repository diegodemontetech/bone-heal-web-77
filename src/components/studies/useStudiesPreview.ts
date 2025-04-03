
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScientificStudy } from "@/types/scientific-study";

export const useStudiesPreview = () => {
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

  const translations = {
    titles: {
      pt: "Estudos Científicos",
      en: "Scientific Studies",
      es: "Estudios Científicos"
    },
    subtitles: {
      pt: "Descubra as evidências científicas que comprovam nossa eficácia",
      en: "Discover the scientific evidence that proves our effectiveness",
      es: "Descubra las evidencias científicas que comprueban nuestra eficacia"
    },
    emptyMessages: {
      pt: "Nenhum estudo científico disponível no momento.",
      en: "No scientific studies available at the moment.",
      es: "Ningún estudio científico disponible en este momento."
    },
    buttonTexts: {
      pt: "Ver todos os estudos",
      en: "View all studies",
      es: "Ver todos los estudios"
    },
    viewDetailsTexts: {
      pt: "Ver detalhes",
      en: "View details",
      es: "Ver detalles"
    }
  };

  return {
    language,
    setLanguage,
    studies,
    isLoading,
    error,
    translations
  };
};
