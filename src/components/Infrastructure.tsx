import { motion } from 'framer-motion';
import { TestTube2, Microscope, Award, Building } from 'lucide-react';

const Infrastructure = () => {
  const features = [
    {
      icon: TestTube2,
      title: "Laboratório de P&D",
      description: "Centro de pesquisa equipado com tecnologia de ponta para desenvolvimento contínuo."
    },
    {
      icon: Microscope,
      title: "Testes de Qualidade",
      description: "Rigoroso controle de qualidade e testes de biocompatibilidade."
    },
    {
      icon: Award,
      title: "Certificações",
      description: "Atendemos aos mais altos padrões regulatórios nacionais e internacionais."
    },
    {
      icon: Building,
      title: "Instalações",
      description: "Ambiente controlado e certificado para produção de dispositivos médicos."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 to-white">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 text-primary">
            Infraestrutura e Pesquisa
          </h2>
          <p className="text-lg text-neutral-600">
            Nossa infraestrutura de ponta garante a qualidade e inovação contínua em nossos produtos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary text-center">
                {feature.title}
              </h3>
              <p className="text-neutral-600 text-center">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Infrastructure;