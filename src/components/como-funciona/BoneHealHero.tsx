
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const BoneHealHero = () => {
  const scrollToProducts = () => {
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-28 md:py-36">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Removendo a div da imagem com falha */}
          
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Barreiras premium para regeneração óssea guiada
          </h1>
          
          <p className="text-lg md:text-xl mb-10 text-white/90 max-w-3xl mx-auto">
            Soluções inovadoras com tecnologia patenteada para regeneração óssea guiada (ROG) 
            com alta previsibilidade, eficácia e versatilidade
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={scrollToProducts}
            >
              Conheça nossos produtos
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border border-dashed border-white text-white bg-transparent hover:bg-white/10"
              asChild
            >
              <a href="#contato">Fale conosco</a>
            </Button>
          </div>
        </motion.div>

        <div className="mt-16 animate-bounce">
          <a 
            href="#products" 
            className="text-white inline-flex flex-col items-center"
            onClick={(e) => {
              e.preventDefault();
              scrollToProducts();
            }}
          >
            <span className="mb-2">Explorar</span>
            <ChevronDown size={24} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default BoneHealHero;
