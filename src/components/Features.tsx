import { Shield, Heart, TrendingUp } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Técnica Simples e Previsível",
      description: "Procedimento padronizado com resultados consistentes e seguros."
    },
    {
      icon: Heart,
      title: "Conforto Pós-Operatório",
      description: "Menor trauma e melhor recuperação para seus pacientes."
    },
    {
      icon: TrendingUp,
      title: "Aumento de Tecido",
      description: "Regeneração óssea e queratinizada eficiente e natural."
    }
  ];

  return (
    <section className="section-padding bg-neutral-50" id="features">
      <div className="container mx-auto container-padding">
        <h2 className="text-3xl md:text-4xl text-center mb-12 text-primary">
          Por que escolher Bone Heal?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-neutral-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;