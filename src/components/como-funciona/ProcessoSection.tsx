
import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ProcessoSection = () => {
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const stepsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      }
    })
  };
  
  // Estágios do processo de regeneração
  const regeneracaoSteps = [
    { 
      image: "https://i.ibb.co/wMSDFzw/1.webp",
      title: "Preparação do Sítio", 
      description: "A área onde ocorreu a perda óssea é cuidadosamente limpa e preparada para a aplicação."
    },
    { 
      image: "https://i.ibb.co/n08JPr6/2.webp",
      title: "Aplicação da Membrana", 
      description: "A membrana BoneHeal é posicionada sobre a área de deficiência óssea."
    },
    { 
      image: "https://i.ibb.co/9981rfF/3.webp",
      title: "Período de Regeneração", 
      description: "A membrana permanece no local por 7 a 15 dias, criando um espaço protegido para formação óssea."
    },
    { 
      image: "https://i.ibb.co/X277PPz/4.webp",
      title: "Remoção da Membrana", 
      description: "A membrana é removida e já é possível observar o tecido ósseo formado na área tratada."
    },
    { 
      image: "https://i.ibb.co/Jq6bMHz/5.webp",
      title: "Formação Completa", 
      description: "O processo de regeneração continua, resultando em uma área com osso suficiente para implantes."
    }
  ];

  return (
    <section id="processo" className="py-20 bg-gray-50" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-primary">
          Processo de Regeneração Óssea com BoneHeal
        </h2>
        
        <div className="grid md:grid-cols-5 gap-4 md:gap-8">
          {regeneracaoSteps.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate={controls}
              variants={stepsVariants}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={step.image} 
                  alt={`Etapa ${index + 1}: ${step.title}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 flex justify-center">
          <Button asChild>
            <Link to="/studies">
              Ver Estudos Científicos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProcessoSection;
