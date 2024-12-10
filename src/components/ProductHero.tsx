import { motion } from "framer-motion";

const ProductHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 to-white pt-24 pb-16">
      <div className="container mx-auto px-8">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-primary mb-6"
          >
            Soluções em Regeneração Óssea Guiada
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-neutral-600 leading-relaxed"
          >
            Conheça nossa linha de produtos, desenvolvidos para simplificar procedimentos, 
            otimizar resultados clínicos e melhorar a experiência do paciente.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;