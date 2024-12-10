import { Shield, Heart, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Técnica Simples e Previsível",
      description: "Procedimento padronizado com resultados consistentes e seguros."
    },
    {
      icon: Heart,
      title: "Conforto Pós-Operatório",
      description: "Menor trauma e melhor recuperação para seus pacientes."
    },
    {
      icon: TrendingUp,
      title: "Aumento de Tecido",
      description: "Regeneração óssea e queratinizada eficiente e natural."
    }
  ];

  return (
    <section className="py-24 bg-neutral-50" id="features">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-primary">
            Por que escolher Bone Heal?
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Tecnologia inovadora que simplifica procedimentos complexos
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;