import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const MissionVision = () => {
  const isMobile = useIsMobile();
  const [currentSlide, setCurrentSlide] = useState(0);

  const cards = [
    {
      title: "Missão",
      content: "Transformar a regeneração óssea guiada em um procedimento simples, eficaz e acessível, contribuindo para a melhor qualidade de vida dos pacientes."
    },
    {
      title: "Visão",
      content: "Ser referência global em soluções para Regeneração Óssea Guiada (ROG), liderando avanços científicos e tecnológicos."
    },
    {
      title: "Valores",
      content: (
        <ul className="text-neutral-600 space-y-2">
          <li>• Inovação</li>
          <li>• Ética</li>
          <li>• Compromisso com Resultado</li>
          <li>• Compromisso Científico</li>
          <li>• Excelência em Atendimento</li>
        </ul>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % cards.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16 text-primary"
        >
          Missão, Visão e Valores
        </motion.h2>
        
        {isMobile ? (
          <div className="relative">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-4 text-primary">{cards[currentSlide].title}</h3>
              {typeof cards[currentSlide].content === 'string' ? (
                <p className="text-neutral-600">{cards[currentSlide].content}</p>
              ) : (
                cards[currentSlide].content
              )}
            </motion.div>
            <div className="flex justify-between mt-6">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-4 text-primary">{card.title}</h3>
                {typeof card.content === 'string' ? (
                  <p className="text-neutral-600">{card.content}</p>
                ) : (
                  card.content
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MissionVision;