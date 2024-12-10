import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Video/GIF Layer - Optimized */}
      <div className="absolute inset-0">
        <img 
          src="https://gflhpcvldqoqjikeepjh.supabase.co/storage/v1/object/public/videos/home.gif" 
          alt="Regeneração óssea em movimento"
          className="w-full h-full object-cover"
          loading="lazy"
          style={{ 
            imageRendering: 'auto',
            objectFit: 'cover'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary-dark/95" />
      </div>

      {/* Content Layer */}
      <div className="relative max-w-[1440px] mx-auto px-8 lg:px-24 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight text-white font-heading">
              A Revolução na Regeneração Óssea Guiada
            </h1>
            <p className="text-xl lg:text-2xl mb-12 text-neutral-100 leading-relaxed font-light">
              Bone Heal – Inovação, Simplicidade e Eficiência para Seus Procedimentos
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <motion.a
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-neutral-100 transition-all duration-200 rounded-full text-primary font-semibold text-lg group shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Conhecer Produtos
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={20} />
              </motion.a>
              <motion.a
                href="/how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-light hover:bg-primary border border-white/20 transition-all duration-200 rounded-full text-white font-semibold text-lg group shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Como Funciona
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={20} />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.4, 1, 0.4],
            y: [0, 10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-white"
        >
          <span className="text-sm mb-2">Role para descobrir mais</span>
          <ChevronDown size={32} className="animate-bounce" />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;