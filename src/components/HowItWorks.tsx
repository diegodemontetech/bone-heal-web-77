import { CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: "Preparação do sítio cirúrgico",
      description: "Limpeza e preparação adequada da área para o procedimento.",
      image: "https://i.ibb.co/wMSDFzw/1.webp"
    },
    {
      title: "Colocação da película",
      description: "Aplicação simples da película de polipropileno Bone Heal.",
      image: "https://i.ibb.co/n08JPr6/2.webp"
    },
    {
      title: "Regeneração natural",
      description: "Processo de regeneração óssea e tecidual guiada.",
      image: "https://i.ibb.co/9981rfF/3.webp"
    },
    {
      title: "Remoção em 7 dias",
      description: "Remoção simples e indolor da película após o período.",
      image: "https://i.ibb.co/X277PPz/4.webp"
    }
  ];

  return (
    <section className="section-padding bg-white" id="how-it-works">
      <div className="container mx-auto container-padding">
        <h2 className="text-3xl md:text-4xl text-center mb-12 text-primary">
          Como Funciona
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-full aspect-square mb-4 rounded-xl overflow-hidden">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-neutral-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;