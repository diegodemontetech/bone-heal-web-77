
import { useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { motion, useInView, useAnimation } from "framer-motion";
import { ChevronDown, PlusCircle, MinusCircle, ArrowRight, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";

const ComoFunciona = () => {
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
  
  // Perguntas frequentes
  const faqs = [
    {
      pergunta: "Qual o tempo de permanência da membrana?",
      resposta: "A membrana BoneHeal não é reabsorvível e precisa ser removida em um segundo procedimento. O período de permanência ideal é geralmente de 7 a 15 dias. Em casos específicos, como quando se utiliza enxerto ósseo em conjunto, esse período pode ser estendido para até 30 dias."
    },
    {
      pergunta: "O procedimento é doloroso?",
      resposta: "O procedimento é realizado sob anestesia local, garantindo o conforto durante a aplicação. O pós-operatório geralmente apresenta desconforto mínimo, controlável com medicação comum para dor."
    },
    {
      pergunta: "Quanto tempo leva para formar o novo osso?",
      resposta: "A formação inicial do osso começa durante o período em que a membrana está em posição. Após a remoção da membrana, o processo de maturação óssea continua por semanas a meses, dependendo da extensão da área tratada."
    },
    {
      pergunta: "Quais cuidados devo ter após o procedimento?",
      resposta: "Manter uma higiene bucal rigorosa, escovando os dentes com cuidado e utilizando um enxaguante bucal recomendado. Evitar alimentos duros ou crocantes na área tratada. Aplicar compressas de gelo na face para reduzir o inchaço. Tomar a medicação prescrita pelo dentista (analgésicos e/ou antibióticos). Retornar às consultas de acompanhamento conforme agendado."
    },
    {
      pergunta: "Qualquer pessoa pode fazer esse procedimento?",
      resposta: "A maioria dos pacientes que necessitam de regeneração óssea pode se beneficiar do tratamento com BoneHeal. No entanto, algumas condições médicas como diabetes não controlado, uso de certos medicamentos ou tabagismo intenso podem afetar o resultado. Uma avaliação completa com seu dentista determinará se você é um bom candidato."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Como Funciona a Regeneração Óssea | BoneHeal</title>
        <meta name="description" content="Entenda como a membrana BoneHeal funciona no processo de regeneração óssea guiada na odontologia." />
      </Helmet>
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Como Funciona a Regeneração Óssea Guiada</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-white/90">
            Descubra como a inovadora membrana BoneHeal revoluciona o processo de regeneração óssea na odontologia
          </p>
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 mr-4"
              asChild
            >
              <Link to="/contact">Fale com um Especialista</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <a href="#processo">Ver o Processo</a>
            </Button>
          </div>
          
          <div className="mt-12 animate-bounce">
            <a href="#rog" className="text-white/80 hover:text-white inline-flex flex-col items-center">
              <span className="mb-2">Saiba mais</span>
              <ChevronDown size={24} />
            </a>
          </div>
        </div>
      </section>
      
      {/* O que é ROG */}
      <section id="rog" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">O que é a Regeneração Óssea Guiada?</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              A Regeneração Óssea Guiada (ROG) é uma técnica odontológica utilizada para aumentar a quantidade de osso em áreas onde houve perda, seja por extração dentária, doença periodontal ou outras causas. A BoneHeal é uma membrana de polipropileno especialmente desenvolvida para guiar o crescimento ósseo nessa região.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-primary">Princípio Fundamental</h3>
              <p className="text-gray-700 mb-6">
                O princípio fundamental da ROG com BoneHeal é criar um espaço protegido para que as células ósseas possam proliferar e formar novo osso, impedindo que tecidos moles (como a gengiva) invadam essa área.
              </p>
              <h3 className="text-2xl font-semibold mb-4 text-primary">Abordagem Única</h3>
              <p className="text-gray-700 mb-6">
                Uma das grandes vantagens da BoneHeal é a possibilidade de utilização sem a necessidade de enxerto ósseo em muitos casos, simplificando o procedimento e reduzindo o desconforto pós-operatório.
              </p>
              <div className="flex items-center text-primary font-medium">
                <Info className="mr-2 h-5 w-5" />
                A membrana BoneHeal pode ser intencionalmente deixada exposta na boca, algo que não é possível com outros tipos de membranas.
              </div>
            </div>
            <div className="bg-gray-100 p-6 rounded-2xl">
              <img 
                src="https://i.ibb.co/5rhwywJ/6.webp" 
                alt="Regeneração Óssea com BoneHeal" 
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Processo passo a passo */}
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
      
      {/* Benefícios */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-primary">
            Benefícios da Regeneração Óssea com BoneHeal
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
      
      {/* Perguntas Frequentes */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-primary">
            Perguntas Frequentes
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-white rounded-lg shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium hover:no-underline">
                    {faq.pergunta}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-0 text-gray-700">
                    {faq.resposta}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Pronto para recuperar seu sorriso com BoneHeal?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
            Entre em contato conosco para saber mais sobre a Regeneração Óssea Guiada e como ela pode transformar sua saúde bucal.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link to="/contact">Fale Conosco</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link to="/products">Ver Produtos</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default ComoFunciona;
