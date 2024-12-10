import { Target, Eye, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const MissionValues = () => {
  const cards = [
    {
      title: "Missão",
      icon: Target,
      content: "Transformar a regeneração óssea guiada em um procedimento simples, eficaz e acessível, contribuindo para a melhor qualidade de vida dos pacientes."
    },
    {
      title: "Visão",
      icon: Eye,
      content: "Ser referência global em soluções para ROG, liderando avanços científicos e tecnológicos."
    },
    {
      title: "Valores",
      icon: Heart,
      content: "Inovação, Ética, Sustentabilidade, Compromisso Científico, Excelência em Atendimento."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 to-white">
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
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <card.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">{card.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{card.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionValues;