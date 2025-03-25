
import { useState } from 'react';

type LanguageOption = 'pt' | 'en' | 'es';

interface LanguageSwitcherProps {
  language: LanguageOption;
  onLanguageChange: (language: LanguageOption) => void;
  className?: string;
}

const LanguageSwitcher = ({ language, onLanguageChange, className = '' }: LanguageSwitcherProps) => {
  return (
    <div className={`flex space-x-2 ${className}`}>
      <button 
        onClick={() => onLanguageChange("pt")}
        className={`flex items-center ${language === "pt" ? "ring-2 ring-primary" : ""} rounded-full overflow-hidden`}
        title="Português"
      >
        <img src="https://flagcdn.com/br.svg" alt="Português" className="w-6 h-6 object-cover" />
      </button>
      <button 
        onClick={() => onLanguageChange("en")}
        className={`flex items-center ${language === "en" ? "ring-2 ring-primary" : ""} rounded-full overflow-hidden`}
        title="English"
      >
        <img src="https://flagcdn.com/gb.svg" alt="English" className="w-6 h-6 object-cover" />
      </button>
      <button 
        onClick={() => onLanguageChange("es")}
        className={`flex items-center ${language === "es" ? "ring-2 ring-primary" : ""} rounded-full overflow-hidden`}
        title="Español"
      >
        <img src="https://flagcdn.com/es.svg" alt="Español" className="w-6 h-6 object-cover" />
      </button>
    </div>
  );
};

export default LanguageSwitcher;
