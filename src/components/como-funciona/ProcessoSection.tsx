
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ProcessoSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="https://cloud-1de12d.b-cdn.net/media/iblock/c8c/c8c6cec8ea15b6eaccf56a98ccff8cc3/b8a87eff5213ee47cb1f67dce9cf4ca9.jpeg" 
              alt="Processo de regeneração óssea"
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              Entenda o Processo
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              O Método ROG-M de regeneração óssea guiada foi desenvolvido pelo Dr. Munir Salomão 
              após anos de pesquisa e prática clínica. O procedimento utiliza a barreira de polipropileno 
              Bone Heal sem a necessidade de enxertos ósseos ou biomateriais.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              A técnica permite que o próprio organismo forme osso de qualidade em áreas onde antes havia 
              deficiência óssea, utilizando apenas o coágulo sanguíneo e células progenitoras.
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => window.open('https://www.youtube.com/watch?v=pDm0nUQ3pCM', '_blank')}
            >
              Ver o Processo em Ação
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProcessoSection;
