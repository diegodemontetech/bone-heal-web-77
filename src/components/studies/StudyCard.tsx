
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Download, Calendar, Link2, Book } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScientificStudy } from "@/types/scientific-study";

interface StudyCardProps {
  study: ScientificStudy;
  language: "pt" | "en" | "es";
  viewDetailsText: string;
}

const StudyCard = ({ study, language, viewDetailsText }: StudyCardProps) => {
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
    <motion.div
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
              {viewDetailsText}
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
  );
};

export default StudyCard;
