import { motion } from "framer-motion";

const AboutHero = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center bg-primary pt-32 pb-24">
      <div className="container mx-auto px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-white">
            Nossa História é Feita de Inovação e Dedicação
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
            Conheça a equipe, a visão e os valores que impulsionam a Bone Heal.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;