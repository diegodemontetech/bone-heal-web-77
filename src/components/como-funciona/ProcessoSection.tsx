
import { motion } from "framer-motion";

const ProcessoSection = () => {
  return (
    <section id="processo" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-primary">
            Entenda o Processo
          </h2>
          <div className="prose prose-lg mx-auto">
            <p className="text-lg text-gray-700 mb-6">
              O Método ROG-M de regeneração óssea guiada foi desenvolvido pelo Dr. Munir Salomão 
              após anos de pesquisa e prática clínica. O procedimento utiliza a barreira de polipropileno 
              Bone Heal sem a necessidade de enxertos ósseos ou biomateriais.
            </p>
            <p className="text-lg text-gray-700">
              A técnica permite que o próprio organismo forme osso de qualidade em áreas onde antes havia 
              deficiência óssea, utilizando apenas o coágulo sanguíneo e células progenitoras.
            </p>
          </div>
          
          <div className="mt-12 w-24 h-1 bg-primary/20 mx-auto rounded-full"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessoSection;
