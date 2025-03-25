
import { CheckCircle } from "lucide-react";

const BenefitsSection = () => {
  // Benefícios do tratamento
  const beneficios = [
    "Técnica cirúrgica simplificada",
    "Menor necessidade de enxertos ósseos",
    "Conforto pós-operatório superior",
    "Resultados previsíveis e confiáveis",
    "Reduzido risco de infecção",
    "Menor morbidade pós-operatória",
    "Controle preciso do tempo de regeneração",
    "Possibilidade de exposição intencional"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-primary">
          Benefícios da regeneração óssea com BoneHeal
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {beneficios.map((beneficio, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-primary mb-4">
                <CheckCircle className="h-10 w-10" />
              </div>
              <p className="font-medium">{beneficio}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto bg-primary/5 rounded-xl p-8 border border-primary/20">
          <h3 className="text-xl font-semibold mb-4 text-primary">Sabia que?</h3>
          <p className="text-gray-700">
            A BoneHeal apresenta uma taxa de sucesso superior a 95% nos casos de regeneração óssea para implantes dentários, tornando-a uma das opções mais confiáveis disponíveis atualmente no mercado.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
