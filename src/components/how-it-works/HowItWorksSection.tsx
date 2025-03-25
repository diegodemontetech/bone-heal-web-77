
import React, { useState } from "react";
import StepCard from "./StepCard";
import { HowItWorksStep, howItWorksSteps } from "@/data/how-it-works-steps";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HowItWorksSectionProps {
  title?: string;
  steps?: HowItWorksStep[];
  className?: string;
  id?: string;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  title = "Como funciona",
  steps = howItWorksSteps,
  className = "",
  id = "how-it-works"
}) => {
  const [language, setLanguage] = useState<'pt' | 'en' | 'es'>('en');
  
  const titles = {
    pt: "COMO FUNCIONA",
    en: "HOW IT WORKS",
    es: "CÓMO FUNCIONA"
  };
  
  return (
    <section className={`section-padding bg-white ${className}`} id={id}>
      <div className="container mx-auto px-4 py-16 relative">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher 
            language={language} 
            onLanguageChange={setLanguage} 
          />
        </div>
        
        <div className="flex items-center justify-center mb-4">
          <h2 className="text-3xl md:text-4xl text-center mb-8 text-primary uppercase font-bold">
            {titles[language]}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white font-semibold uppercase px-8 py-6 text-lg fixed bottom-8"
            onClick={() => window.open('/studies', '_blank')}
          >
            <Download className="w-5 h-5 mr-2" />
            BAIXAR PDF ESTUDOS
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
