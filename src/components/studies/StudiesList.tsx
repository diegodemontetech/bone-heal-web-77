
import { Link } from "react-router-dom";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScientificStudy } from "@/types/scientific-study";
import StudyCard from "./StudyCard";

interface StudiesListProps {
  studies: ScientificStudy[] | null;
  isLoading: boolean;
  error: Error | null;
  language: "pt" | "en" | "es";
  emptyMessage: string;
  viewDetailsText: string;
  buttonText: string;
}

const StudiesList = ({ 
  studies, 
  isLoading, 
  error, 
  language,
  emptyMessage,
  viewDetailsText,
  buttonText
}: StudiesListProps) => {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6 max-w-lg mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          Não foi possível carregar os estudos científicos. Por favor, tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
        <span>Carregando estudos...</span>
      </div>
    );
  }

  if (!studies || studies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {studies.map((study) => (
          <StudyCard 
            key={study.id} 
            study={study} 
            language={language}
            viewDetailsText={viewDetailsText}
          />
        ))}
      </div>
      
      <div className="text-center">
        <Link
          to="/studies"
          className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-semibold"
        >
          {buttonText}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </>
  );
};

export default StudiesList;
