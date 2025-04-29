
import React from 'react';
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import LeadsterChat from "@/components/LeadsterChat";

const Sobre = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Sobre Nós | BoneHeal</title>
        <meta name="description" content="Conheça a história e missão da BoneHeal, empresa especializada em soluções inovadoras para regeneração óssea guiada." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Sobre Nós</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Uma empresa dedicada à inovação em regeneração óssea guiada para odontologia.
            </p>
          </div>
        </section>
        
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg">
              <h2>Nossa História</h2>
              <p>
                A BoneHeal nasceu da necessidade de oferecer soluções mais eficientes e menos invasivas para procedimentos de regeneração óssea na odontologia.
              </p>
              
              <h2>Nossa Missão</h2>
              <p>
                Desenvolver e disponibilizar tecnologias de ponta para regeneração óssea guiada, proporcionando resultados previsíveis e menos traumáticos para os pacientes.
              </p>
              
              <h2>Nossa Visão</h2>
              <p>
                Ser referência global em soluções inovadoras para regeneração óssea, contribuindo para a evolução da odontologia e melhoria da qualidade de vida dos pacientes.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <WhatsAppWidget />
      <LeadsterChat 
        title="Fale com nossa equipe"
        message="Olá! Gostaria de saber mais sobre a BoneHeal? Estou à disposição para ajudar!"
      />
    </div>
  );
};

export default Sobre;
