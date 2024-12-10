import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Commitment = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-bold mb-8 text-primary">
            Compromisso com o Paciente e o Profissional
          </h2>
          <p className="text-lg text-neutral-600 leading-relaxed mb-8">
            Cada solução desenvolvida pela Bone Heal busca o bem-estar do paciente, 
            respeitando a natureza biológica da regeneração e oferecendo ferramentas 
            seguras aos cirurgiões-dentistas.
          </p>
          <p className="text-lg text-neutral-600 leading-relaxed">
            Nossa dedicação à excelência se reflete em cada aspecto do nosso trabalho, 
            desde a pesquisa e desenvolvimento até o suporte pós-venda aos profissionais.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Commitment;