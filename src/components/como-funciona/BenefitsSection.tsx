
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Award, 
  Heart, 
  ShieldCheck, 
  Clock, 
  BarChart, 
  Lightbulb,
  Scissors,
  Activity
} from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <CheckCircle className="h-10 w-10" />,
      title: "Técnica cirúrgica simplificada",
      description: "Procedimento menos invasivo e mais rápido"
    },
    {
      icon: <Activity className="h-10 w-10" />,
      title: "Menor morbidade pós-operatória",
      description: "Recuperação mais confortável para o paciente"
    },
    {
      icon: <Heart className="h-10 w-10" />,
      title: "Conforto superior",
      description: "Maior bem-estar durante o período de cicatrização"
    },
    {
      icon: <Scissors className="h-10 w-10" />,
      title: "Dispensa de enxertos ósseos",
      description: "Em muitos casos, elimina a necessidade de procedimentos adicionais"
    },
    {
      icon: <ShieldCheck className="h-10 w-10" />,
      title: "Reduzido risco de infecção",
      description: "Maior segurança durante o processo de regeneração"
    },
    {
      icon: <BarChart className="h-10 w-10" />,
      title: "Resultados previsíveis",
      description: "Alta taxa de sucesso e confiabilidade clínica"
    },
    {
      icon: <Clock className="h-10 w-10" />,
      title: "Controle de regeneração",
      description: "Controle preciso do tempo de regeneração óssea"
    },
    {
      icon: <Lightbulb className="h-10 w-10" />,
      title: "Exposição intencional",
      description: "Possibilidade de exposição sem comprometer resultados"
    }
  ];

  const differentials = [
    {
      title: "Tecnologia Patenteada",
      description: "Método ROG-M desenvolvido pelo Dr. Munir Salomão com resultados comprovados."
    },
    {
      title: "Comprovação Científica",
      description: "Mais de 25 artigos científicos publicados demonstrando a eficácia das barreiras."
    },
    {
      title: "Liderança de Mercado",
      description: "Mais de 500.000 barreiras vendidas, com presença em todo o Brasil."
    },
    {
      title: "Qualidade e Segurança",
      description: "Produtos certificados pela ANVISA, seguindo os mais altos padrões de qualidade."
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Por que escolher Bone Heal
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
            Benefícios e Diferenciais
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubra as vantagens exclusivas das barreiras Bone Heal® e Heal Bone® para sua prática clínica
          </p>
        </div>
        
        <h3 className="text-2xl font-bold mb-8 text-primary">Principais Benefícios</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="text-primary mb-4">
                {benefit.icon}
              </div>
              <h4 className="text-lg font-semibold mb-2">{benefit.title}</h4>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 lg:p-12">
          <h3 className="text-2xl font-bold mb-8 text-primary">Diferenciais Exclusivos</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {differentials.map((differential, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                    <Award className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">{differential.title}</h4>
                  <p className="text-gray-700">{differential.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 p-6 bg-white rounded-xl border border-primary/20">
            <h4 className="text-xl font-semibold mb-4 text-primary">Sabia que?</h4>
            <p className="text-gray-700">
              A BoneHeal apresenta uma taxa de sucesso superior a 95% nos casos de regeneração óssea para 
              implantes dentários, tornando-a uma das opções mais confiáveis disponíveis atualmente no mercado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
