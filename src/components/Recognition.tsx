import { motion } from 'framer-motion';

const Recognition = () => {
  const achievements = [
    {
      title: "Certificação",
      description: "Produtos registrados e aprovados para uso em território nacional. Certificado de Boas Práticas de Fabricação.",
      image: "https://www.gov.br/cdtn/pt-br/imagens/CertificadoBPF.png"
    },
    {
      title: "Patentes",
      description: "Tecnologia protegida e reconhecida internacionalmente. Mais de 10 patentes nacionais e internacionais.",
      image: "https://robotx.com.br/wp-content/uploads/2022/02/Selo-produto-INPI.png"
    },
    {
      title: "Direitos Autorais",
      description: "Método ROG-M de Munir Salomão.",
      image: "https://www.consulog.com.br/wp-content/uploads/2022/03/selo-anvisa.webp"
    },
    {
      title: "Prêmios",
      description: "Reconhecimento da comunidade científica e odontológica.",
      image: "https://www.abo.org.br/images/seloFull.jpg"
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
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img 
                src={achievement.image} 
                alt={achievement.title}
                className="w-32 h-32 object-contain mx-auto mb-6"
              />
              <h3 className="text-xl font-bold mb-4 text-primary text-center">{achievement.title}</h3>
              <p className="text-neutral-600 text-center">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recognition;