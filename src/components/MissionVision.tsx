import { motion } from 'framer-motion';

const MissionVision = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16 text-primary"
        >
          Missão, Visão e Valores
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-4 text-primary">Missão</h3>
            <p className="text-neutral-600">
              Transformar a regeneração óssea guiada em um procedimento simples, eficaz e acessível, 
              contribuindo para a melhor qualidade de vida dos pacientes.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-4 text-primary">Visão</h3>
            <p className="text-neutral-600">
              Ser referência global em soluções para Regeneração Óssea Guiada (ROG), 
              liderando avanços científicos e tecnológicos.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg lg:col-span-1 md:col-span-2 lg:col-start-2"
          >
            <h3 className="text-2xl font-bold mb-4 text-primary">Valores</h3>
            <ul className="text-neutral-600 space-y-2">
              <li>• Inovação</li>
              <li>• Ética</li>
              <li>• Compromisso com Resultado</li>
              <li>• Compromisso Científico</li>
              <li>• Excelência em Atendimento</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;