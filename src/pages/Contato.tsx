
import React from 'react';
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import ContactSection from "@/components/contact/ContactSection";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contato = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Contato | BoneHeal</title>
        <meta name="description" content="Entre em contato com a equipe BoneHeal para mais informações sobre nossos produtos e soluções para regeneração óssea guiada." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Entre em Contato</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Estamos à disposição para esclarecer suas dúvidas e atender às suas necessidades.
            </p>
          </div>
        </section>
        
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Envie sua mensagem</h2>
              <ContactSection />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Informações de Contato</h2>
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <div className="flex items-start">
                  <MapPin className="text-primary h-6 w-6 flex-shrink-0 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800">Endereço</h3>
                    <p className="text-gray-600">Rua João Floriano Terra, 55 - Sala 801</p>
                    <p className="text-gray-600">Campinas - SP, Brasil</p>
                    <p className="text-gray-600">CEP 13083-795</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="text-primary h-6 w-6 flex-shrink-0 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800">Telefone</h3>
                    <p className="text-gray-600">
                      <a href="tel:+551143264252" className="hover:text-primary">(11) 4326-4252</a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="text-primary h-6 w-6 flex-shrink-0 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800">E-mail</h3>
                    <p className="text-gray-600">
                      <a href="mailto:contato@boneheal.com.br" className="hover:text-primary">contato@boneheal.com.br</a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="text-primary h-6 w-6 flex-shrink-0 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800">Horário de Atendimento</h3>
                    <p className="text-gray-600">Segunda a Sexta: 9h às 18h</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 h-80 rounded-lg overflow-hidden shadow-sm">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.356219883906!2d-47.06588908503433!3d-22.906659585015194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8c89819af6c0d%3A0xd5582ffca9929b9f!2sRua%20Jo%C3%A3o%20Floriano%20Terra%2C%2055%20-%20Campinas%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1619021234567!5m2!1spt-BR!2sbr" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  title="Localização BoneHeal"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Contato;
