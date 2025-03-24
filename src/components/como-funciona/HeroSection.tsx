
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20 md:py-28">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">Como Funciona a Regeneração Óssea Guiada</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-white/90">
          Descubra como a inovadora membrana BoneHeal revoluciona o processo de regeneração óssea na odontologia
        </p>
        <div className="flex justify-center">
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 mr-4"
            asChild
          >
            <Link to="/contact">Fale com um Especialista</Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white/10"
            asChild
          >
            <a href="#processo">Ver o Processo</a>
          </Button>
        </div>
        
        <div className="mt-12 animate-bounce">
          <a href="#rog" className="text-white/80 hover:text-white inline-flex flex-col items-center">
            <span className="mb-2">Saiba mais</span>
            <ChevronDown size={24} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
