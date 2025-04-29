
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AutoChat from "@/components/AutoChat";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/5 to-primary/20 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">Como Funciona</h1>
            <p className="text-lg max-w-3xl mx-auto text-gray-700">
              Entenda o processo revolucionário de regeneração óssea da Bone Heal e como nossos produtos podem transformar sua prática clínica.
            </p>
          </div>
        </section>

        {/* Technology Explanation */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-6">A Tecnologia Bone Heal</h2>
                <p className="text-gray-700 mb-4">
                  A tecnologia Bone Heal se baseia em um princípio inovador: utilizar apenas o coágulo sanguíneo, sem adição de enxertos ou implante de biomateriais de qualquer natureza, para promover a regeneração óssea.
                </p>
                <p className="text-gray-700 mb-4">
                  Nossa membrana biocompatível e não-reabsorvível cria o ambiente ideal para que as células do próprio organismo realizem o processo de regeneração óssea de forma natural e eficiente.
                </p>
                <p className="text-gray-700">
                  O resultado é uma técnica cirúrgica simples, segura e previsível, que proporciona excelentes resultados clínicos com menor morbidade para o paciente.
                </p>
              </div>
              <div>
                <img 
                  src="/technology-image.jpg" 
                  alt="Tecnologia Bone Heal"
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>

            {/* Process Steps */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Passo a Passo</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-primary font-bold">
                    1
                  </div>
                  <h3 className="font-bold text-xl mb-3">Preparação</h3>
                  <p className="text-gray-700">
                    Após a exodontia, o alvéolo é cuidadosamente limpo e preparado para receber a membrana.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-primary font-bold">
                    2
                  </div>
                  <h3 className="font-bold text-xl mb-3">Colocação</h3>
                  <p className="text-gray-700">
                    A membrana Bone Heal é posicionada sobre o alvéolo, com a porção mais longa voltada para vestibular.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-primary font-bold">
                    3
                  </div>
                  <h3 className="font-bold text-xl mb-3">Fixação</h3>
                  <p className="text-gray-700">
                    A membrana é suturada ao retalho utilizando fio cirúrgico, garantindo sua estabilidade.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-primary font-bold">
                    4
                  </div>
                  <h3 className="font-bold text-xl mb-3">Regeneração</h3>
                  <p className="text-gray-700">
                    O coágulo sanguíneo se forma sob a membrana, iniciando o processo natural de regeneração óssea.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-primary font-bold">
                    5
                  </div>
                  <h3 className="font-bold text-xl mb-3">Acompanhamento</h3>
                  <p className="text-gray-700">
                    O paciente é acompanhado periodicamente para avaliar o processo de cicatrização.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-primary font-bold">
                    6
                  </div>
                  <h3 className="font-bold text-xl mb-3">Remoção</h3>
                  <p className="text-gray-700">
                    Após o período adequado, a membrana é removida, revelando o novo osso formado.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Benefícios</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Técnica Simples</h3>
                    <p className="text-gray-700">
                      Procedimento cirúrgico simplificado, reduzindo o tempo operatório e a curva de aprendizado.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Menor Morbidade</h3>
                    <p className="text-gray-700">
                      Redução da dor e do desconforto pós-operatório para o paciente.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Resultados Previsíveis</h3>
                    <p className="text-gray-700">
                      Alta taxa de sucesso clínico, com formação óssea consistente e de qualidade.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Sem Biomateriais</h3>
                    <p className="text-gray-700">
                      Eliminação da necessidade de enxertos ósseos ou outros biomateriais.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Versatilidade</h3>
                    <p className="text-gray-700">
                      Aplicável em diversos casos clínicos, desde extrações simples até situações complexas.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Custo-Benefício</h3>
                    <p className="text-gray-700">
                      Economia em comparação com técnicas que utilizam diversos biomateriais.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center">Perguntas Frequentes</h2>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg mb-2">Por quanto tempo a membrana deve permanecer em posição?</h3>
                  <p className="text-gray-700">
                    A membrana deve permanecer em posição por aproximadamente 4 a 6 semanas, dependendo do caso clínico e da indicação específica.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg mb-2">A membrana Bone Heal pode ser usada em todos os tipos de defeitos ósseos?</h3>
                  <p className="text-gray-700">
                    A membrana é especialmente indicada para casos pós-exodontia, perda de parede alveolar, casos de implantes imediatos e correção de fenestrações ósseas. Para outros tipos de defeitos, consulte um especialista.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg mb-2">Existem contraindicações para o uso da membrana?</h3>
                  <p className="text-gray-700">
                    As principais contraindicações incluem pacientes com infecções ativas na área a ser tratada e pacientes com doenças sistêmicas não controladas que afetem o processo de cicatrização.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg mb-2">É necessário algum cuidado especial pós-operatório?</h3>
                  <p className="text-gray-700">
                    Sim, o paciente deve seguir as orientações de higiene bucal, evitar pressionar a área operada e seguir a prescrição medicamentosa indicada pelo profissional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Pronto para transformar sua prática clínica?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Conheça nossos produtos e descubra como a tecnologia Bone Heal pode ajudar você e seus pacientes
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/produtos">
                <Button className="bg-white text-primary hover:bg-gray-100">
                  Ver Produtos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contato">
                <Button variant="outline" className="text-white border-white hover:bg-white/10">
                  Fale Conosco
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AutoChat />
    </div>
  );
};

export default HowItWorksPage;
