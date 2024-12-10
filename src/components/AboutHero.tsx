import { motion } from "framer-motion";

const AboutHero = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-primary/10 to-white pt-32 pb-24">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=2400&q=80')] opacity-10 bg-cover bg-center" />
      <div className="container mx-auto px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-primary">
            Nossa História é Feita de Inovação e Dedicação
          </h1>
          <p className="text-xl lg:text-2xl text-neutral-600 leading-relaxed">
            Conheça a equipe, a visão e os valores que impulsionam a Bone Heal.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;