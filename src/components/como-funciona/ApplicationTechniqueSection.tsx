
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const ApplicationTechniqueSection = () => {
  const steps = [
    {
      id: 1,
      title: "Preparação Inicial",
      description: "Limpeza e preparação do sítio cirúrgico, garantindo um ambiente propício para a regeneração."
    },
    {
      id: 2,
      title: "Aplicação da Barreira",
      description: "Posicionamento preciso da barreira sobre o defeito ósseo, estabilizando-a para guiar a regeneração."
    },
    {
      id: 3,
      title: "Formação Óssea",
      description: "Durante o período de cicatrização, o coágulo sanguíneo se organiza e inicia-se a formação de novo osso."
    },
    {
      id: 4,
      title: "Resultado Final",
      description: "Após a remoção da barreira, observa-se a formação de novo osso de qualidade no local do defeito."
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
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex items-center mb-4">
                <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                  {step.id}
                </div>
                <h3 className="text-xl font-bold text-primary">{step.title}</h3>
              </div>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApplicationTechniqueSection;
