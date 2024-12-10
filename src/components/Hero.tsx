import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="hero-gradient min-h-screen flex items-center text-white pt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Regeneração Óssea Guiada sem enxertos
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-neutral-100">
            Inovação e segurança para cirurgiões-dentistas
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#products"
              className="inline-flex items-center justify-center px-6 py-3 bg-accent hover:bg-accent-light transition-colors duration-200 rounded-lg text-white font-semibold"
            >
              Conhecer Produtos
              <ArrowRight className="ml-2" size={20} />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-neutral-100 transition-colors duration-200 rounded-lg text-primary font-semibold"
            >
              Como Funciona
              <ArrowRight className="ml-2" size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;