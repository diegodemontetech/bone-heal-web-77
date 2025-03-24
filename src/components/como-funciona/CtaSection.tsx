
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Pronto para recuperar seu sorriso com BoneHeal?
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
          Entre em contato conosco para saber mais sobre a Regeneração Óssea Guiada e como ela pode transformar sua saúde bucal.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90"
            asChild
          >
            <Link to="/contact">Fale Conosco</Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white/10"
            asChild
          >
            <Link to="/products">Ver Produtos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
