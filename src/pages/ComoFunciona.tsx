
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadsterChat from "@/components/LeadsterChat";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

const ComoFunciona = () => {
  const steps = [
    {
      id: 1,
      title: "Preparação do sítio cirúrgico",
      description: "Limpeza e preparação adequada da área para o procedimento.",
      image: "https://boneheal.com.br/wp-content/uploads/2023/05/passo-1.jpg"
    },
    {
      id: 2,
      title: "Colocação da película",
      description: "Aplicação simples da película de polipropileno Bone Heal.",
      image: "https://boneheal.com.br/wp-content/uploads/2023/05/passo-2.jpg"
    },
    {
      id: 3,
      title: "Regeneração natural",
      description: "Processo de regeneração óssea e tecidual guiada.",
      image: "https://boneheal.com.br/wp-content/uploads/2023/05/passo-3.jpg"
    },
    {
      id: 4,
      title: "Remoção em 7 dias",
      description: "Remoção simples e indolor da película após o período.",
      image: "https://boneheal.com.br/wp-content/uploads/2023/05/passo-4.jpg"
    }
  ];

  const benefits = [
    "Dispensa o uso de enxertos, biomateriais e parafusos",
    "Técnica cirúrgica simplificada",
    "Não requer segunda cirurgia para remoção",
    "Menor morbidade para o paciente",
    "Excelentes resultados clínicos",
    "Compatível com todos os sistemas de implantes"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Como Funciona | BoneHeal</title>
        <meta name="description" content="Entenda como funciona o processo de regeneração óssea guiada com os produtos BoneHeal." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section id="rog" className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Como Funciona a Regeneração Óssea Guiada</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Descubra como as membranas BoneHeal revolucionam o processo de regeneração óssea
            </p>
          </div>
        </section>
        
        {/* What is ROG */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">O que é Regeneração Óssea Guiada?</h2>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <p className="text-lg mb-4">
                    A Regeneração Óssea Guiada (ROG) é uma técnica cirúrgica que visa promover o crescimento de 
                    tecido ósseo em áreas onde ele é insuficiente, principalmente para viabilizar a instalação de implantes dentários.
                  </p>
                  <p className="text-lg mb-4">
                    O princípio fundamental da ROG é a utilização de uma barreira física (membrana) para impedir 
                    que as células do tecido mole, que se proliferam mais rapidamente, invadam a área que deve ser 
                    preenchida por células ósseas.
                  </p>
                  <p className="text-lg">
                    As membranas BoneHeal são dispositivos médicos implantáveis de polipropileno que atuam como 
                    barreiras 100% impermeáveis, criando o ambiente ideal para a regeneração óssea.
                  </p>
                </div>
                
                <div className="md:w-1/2">
                  <img 
                    src="https://boneheal.com.br/wp-content/uploads/2023/05/rog-explicacao.jpg" 
                    alt="Regeneração Óssea Guiada" 
                    className="rounded-lg shadow-md w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Process Steps */}
        <section id="processo" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Processo de Aplicação</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {steps.map((step) => (
                <div key={step.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={step.image} 
                      alt={step.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                        {step.id}
                      </div>
                      <h3 className="font-bold">{step.title}</h3>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Vantagens da Técnica</h2>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-center mt-12">
                <Button asChild size="lg">
                  <Link to="/produtos">
                    Conhecer produtos
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Clinical Results */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Resultados Clínicos</h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Confira os excelentes resultados obtidos com a técnica BoneHeal
            </p>
            
            <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
              <div className="md:w-1/2 bg-white rounded-lg overflow-hidden shadow-md">
                <div className="p-4 border-b">
                  <h3 className="font-bold">Antes do procedimento</h3>
                </div>
                <img 
                  src="https://boneheal.com.br/wp-content/uploads/2023/05/resultado-antes.jpg"
                  alt="Antes do procedimento"
                  className="w-full h-64 object-cover"
                />
              </div>
              
              <div className="md:w-1/2 bg-white rounded-lg overflow-hidden shadow-md">
                <div className="p-4 border-b">
                  <h3 className="font-bold">4 meses depois</h3>
                </div>
                <img 
                  src="https://boneheal.com.br/wp-content/uploads/2023/05/resultado-depois.jpg"
                  alt="Depois do procedimento"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button variant="outline" asChild>
                <Link to="/casos-clinicos">
                  Ver todos os casos clínicos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Transforme seus procedimentos de regeneração óssea</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Entre em contato conosco e descubra como as soluções BoneHeal podem simplificar seus procedimentos e melhorar seus resultados clínicos.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link to="/contato">Fale com um especialista</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
      <LeadsterChat 
        title="Dúvidas sobre a técnica?"
        message="Olá! Posso esclarecer suas dúvidas sobre a técnica de regeneração óssea com BoneHeal?"
      />
    </div>
  );
};

export default ComoFunciona;
