import { motion } from 'framer-motion';
import { Award, FileText, Star, Shield } from 'lucide-react';

const Recognition = () => {
  const achievements = [
    {
      icon: Award,
      title: "Certificação ANVISA",
      description: "Produto registrado e aprovado para uso em território nacional"
    },
    {
      icon: FileText,
      title: "Patentes",
      description: "Tecnologia protegida e reconhecida internacionalmente"
    },
    {
      icon: Star,
      title: "Prêmios",
      description: "Reconhecimento da comunidade científica e odontológica"
    },
    {
      icon: Shield,
      title: "ISO 13485",
      description: "Sistema de gestão da qualidade para dispositivos médicos"
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
          Reconhecimentos e Certificações
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                <achievement.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary">{achievement.title}</h3>
              <p className="text-neutral-600">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recognition;