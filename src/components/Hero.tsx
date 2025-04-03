
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const Hero = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-primary">
      {/* GIF Background with dark overlay */}
      <div className="absolute inset-0 overflow-hidden"> 
        <img
          src="https://s3.gifyu.com/images/bSSkw.gif"
          alt="Bone Heal Background"
          className="absolute w-[150%] h-[150%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none"
          style={{
            filter: 'brightness(0.7)',
          }}
        />
      </div>

      {/* Background gradient overlay mais intenso para uniformidade */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/85 to-primary-dark/95" />

      {/* Content Layer */}
      <div className="relative max-w-[1440px] mx-auto px-8 lg:px-24 py-32 mt-20">
        <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 100
            }}
            className="max-w-2xl"
          >
            <motion.h1 
              className="text-5xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight text-white font-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              A Revolução na Regeneração Óssea Guiada
            </motion.h1>
            <motion.p 
              className="text-xl lg:text-2xl mb-12 text-neutral-100 leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Bone Heal® – Inovação, Simplicidade e Eficiência para Seus Procedimentos
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.a
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-neutral-100 transition-all duration-300 rounded-full text-primary font-semibold text-lg group shadow-lg hover:shadow-xl"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Conhecer Produtos
                <motion.span
                  className="inline-block ml-2"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <ArrowRight size={20} />
                </motion.span>
              </motion.a>
              <motion.a
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-dashed border-white transition-all duration-300 rounded-full text-white font-semibold text-lg group shadow-lg hover:shadow-xl hover:bg-white/10"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Torne-se Cliente
                <motion.span
                  className="inline-block ml-2"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <ArrowRight size={20} />
                </motion.span>
              </motion.a>
            </motion.div>
          </motion.div>

        {/* Scroll Indicator with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: [0, 1, 0],
            y: [0, 10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-center text-white w-auto"
        >
          <motion.span 
            className="text-sm mb-2 whitespace-nowrap"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Role para descobrir mais
          </motion.span>
          <motion.div
            animate={{ 
              y: [0, 8, 0],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ChevronDown size={32} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
