import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-8 text-primary">
            Deseja Saber Mais?
          </h2>
          <p className="text-lg text-neutral-600 mb-12">
            Explore nossos estudos científicos, conheça nossos produtos ou entre em contato conosco.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-full transition-colors duration-200 font-semibold"
            >
              Entrar em Contato
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/studies"
              className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-primary text-primary hover:bg-primary/5 rounded-full transition-colors duration-200 font-semibold"
            >
              Ver Estudos Científicos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/news"
              className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-primary text-primary hover:bg-primary/5 rounded-full transition-colors duration-200 font-semibold"
            >
              Acompanhe Nossas Notícias
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;