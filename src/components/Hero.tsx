import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const stats = [
    { value: '98%', label: 'Taxa de Sucesso' },
    { value: '7', label: 'Dias de Cicatrização' },
    { value: '10k+', label: 'Cirurgias Realizadas' },
    { value: '0', label: 'Complicações' },
  ];

  return (
    <div className="hero-gradient min-h-screen flex items-center text-white pt-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Regeneração Óssea Guiada sem enxertos
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-neutral-100 leading-relaxed">
              Inovação e segurança para cirurgiões-dentistas. Transforme seus procedimentos com tecnologia de ponta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent-light transition-colors duration-200 rounded-lg text-white font-semibold text-lg"
              >
                Conhecer Produtos
                <ArrowRight className="ml-2" size={20} />
              </a>
              <a
                href="/how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-neutral-100 transition-colors duration-200 rounded-lg text-primary font-semibold text-lg"
              >
                Como Funciona
                <ArrowRight className="ml-2" size={20} />
              </a>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center"
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-neutral-200">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;