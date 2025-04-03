
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  ArrowRight, 
  Download, 
  Calendar, 
  AlertCircle, 
  Loader2, 
  FileText, 
  Link2, 
  Book, 
  BookOpen,
  Filter
} from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ScientificStudy } from "@/types/scientific-study";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterCategory = "all" | "clinical-case" | "systematic-review" | "randomized-trial" | "laboratory-study" | "other";

const Studies = () => {
  const [language, setLanguage] = useState<"pt" | "en" | "es">("pt");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: studies, isLoading, error } = useQuery({
    queryKey: ["studies-full"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("scientific_studies")
          .select("*")
          .order("published_date", { ascending: false });
        
        if (error) throw error;
        return data as ScientificStudy[];
      } catch (error) {
        console.error("Erro ao buscar estudos:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Extract unique years for the year filter - safely handle undefined years
  const availableYears = studies 
    ? [...new Set(studies
        .filter(study => study.year !== undefined && study.year !== null)
        .map(study => study.year))]
        .sort((a, b) => b - a)
    : [];

  // Apply filters - safely handle undefined properties
  const filteredStudies = studies?.filter(study => {
    // Year filter - handle undefined year
    if (yearFilter !== "all" && study.year !== parseInt(yearFilter)) {
      return false;
    }
    
    // Category filter
    if (categoryFilter !== "all" && study.category !== categoryFilter) {
      return false;
    }
    
    // Search query filter - safely handle optional fields
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (study.title?.toLowerCase().includes(query) || false) ||
        (study.authors?.toLowerCase().includes(query) || false) ||
        (study.journal?.toLowerCase().includes(query) || false) ||
        (study.description?.toLowerCase().includes(query) || false) ||
        (study.abstract?.toLowerCase().includes(query) || false)
      );
    }
    
    return true;
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

  const searchPlaceholders = {
    pt: "Buscar por título, autor ou conteúdo...",
    en: "Search by title, author or content...",
    es: "Buscar por título, autor o contenido..."
  };

  const categoryLabels = {
    pt: {
      all: "Todas categorias",
      "clinical-case": "Casos Clínicos",
      "systematic-review": "Revisões Sistemáticas",
      "randomized-trial": "Ensaios Clínicos",
      "laboratory-study": "Estudos Laboratoriais",
      "other": "Outros"
    },
    en: {
      all: "All categories",
      "clinical-case": "Clinical Cases",
      "systematic-review": "Systematic Reviews",
      "randomized-trial": "Clinical Trials",
      "laboratory-study": "Laboratory Studies",
      "other": "Others"
    },
    es: {
      all: "Todas categorías",
      "clinical-case": "Casos Clínicos",
      "systematic-review": "Revisiones Sistemáticas",
      "randomized-trial": "Ensayos Clínicos",
      "laboratory-study": "Estudios de Laboratorio",
      "other": "Otros"
    }
  };

  const yearLabels = {
    pt: "Todos os anos",
    en: "All years",
    es: "Todos los años"
  };

  const getCategoryColor = (category: string) => {
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

  const getCategoryLabel = (category: string, lang: "pt" | "en" | "es") => {
    return categoryLabels[lang][category as keyof typeof categoryLabels[typeof lang]];
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

          <p className="text-lg text-gray-600 mb-8 max-w-3xl">
            {subtitles[language]}
          </p>

          {/* Filters */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={searchPlaceholders[language]}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as FilterCategory)}>
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder={categoryLabels[language].all} />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{categoryLabels[language].all}</SelectItem>
                <SelectItem value="clinical-case">{categoryLabels[language]["clinical-case"]}</SelectItem>
                <SelectItem value="systematic-review">{categoryLabels[language]["systematic-review"]}</SelectItem>
                <SelectItem value="randomized-trial">{categoryLabels[language]["randomized-trial"]}</SelectItem>
                <SelectItem value="laboratory-study">{categoryLabels[language]["laboratory-study"]}</SelectItem>
                <SelectItem value="other">{categoryLabels[language]["other"]}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder={yearLabels[language]} />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{yearLabels[language]}</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year !== null && year !== undefined ? year.toString() : ""}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
          ) : filteredStudies && filteredStudies.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudies.map((study) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-neutral-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-sm text-neutral-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(new Date(study.published_date), "d 'de' MMMM, yyyy", { locale: ptBR })}
                      </div>
                      
                      {study.category && (
                        <Badge className={getCategoryColor(study.category)}>
                          {getCategoryLabel(study.category, language)}
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{study.title}</h3>
                    
                    <p className="text-sm text-neutral-600 mb-3 font-medium">
                      {study.authors}
                    </p>
                    
                    <p className="text-sm text-neutral-500 mb-4 italic">
                      {study.journal}
                      {study.year !== null && study.year !== undefined ? `, ${study.year}` : ''}
                    </p>
                    
                    <p className="text-neutral-600 mb-6 line-clamp-4">
                      {study.description || study.abstract}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
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
