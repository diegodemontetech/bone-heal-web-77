
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const ApplicationTechniqueSection = () => {
  const steps = [
    {
      id: 1,
      title: "Preparação Inicial",
      description: "Limpeza e preparação do sítio cirúrgico, garantindo um ambiente propício para a regeneração.",
      image: "https://i.ibb.co/wMSDFzw/1.webp"
    },
    {
      id: 2,
      title: "Aplicação da Barreira",
      description: "Posicionamento preciso da barreira sobre o defeito ósseo, estabilizando-a para guiar a regeneração.",
      image: "https://i.ibb.co/n08JPr6/2.webp"
    },
    {
      id: 3,
      title: "Formação Óssea",
      description: "Durante o período de cicatrização, o coágulo sanguíneo se organiza e inicia-se a formação de novo osso.",
      image: "https://i.ibb.co/9981rfF/3.webp"
    },
    {
      id: 4,
      title: "Resultado Final",
      description: "Após a remoção da barreira, observa-se a formação de novo osso de qualidade no local do defeito.",
      image: "https://i.ibb.co/X277PPz/4.webp"
    }
  ];

  return (
    <section id="technique" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Passo a Passo
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
            Técnica de Aplicação
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Conheça o processo simplificado de aplicação das barreiras Bone Heal® e Heal Bone® para regeneração óssea guiada
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: step.id * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="relative aspect-video">
                <img 
                  src={step.image} 
                  alt={step.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {step.id}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 text-primary">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90"
            onClick={() => window.open('https://www.youtube.com/watch?v=pDm0nUQ3pCM', '_blank')}
          >
            <Play className="mr-2 h-4 w-4" /> Assistir Vídeo Demonstrativo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ApplicationTechniqueSection;
