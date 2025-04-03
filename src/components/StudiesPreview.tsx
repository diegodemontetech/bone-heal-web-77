
import { motion } from "framer-motion";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import StudiesHeader from "./studies/StudiesHeader";
import StudiesList from "./studies/StudiesList";
import { useStudiesPreview } from "./studies/useStudiesPreview";

const StudiesPreview = () => {
  const { 
    language, 
    setLanguage, 
    studies, 
    isLoading, 
    error, 
    translations 
  } = useStudiesPreview();

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-8">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher 
            language={language}
            onLanguageChange={setLanguage}
          />
        </div>
        
        <StudiesHeader 
          title={translations.titles[language]} 
          subtitle={translations.subtitles[language]} 
        />

        <StudiesList 
          studies={studies} 
          isLoading={isLoading} 
          error={error} 
          language={language}
          emptyMessage={translations.emptyMessages[language]}
          viewDetailsText={translations.viewDetailsTexts[language]}
          buttonText={translations.buttonTexts[language]}
        />
      </div>
    </section>
  );
};

export default StudiesPreview;
