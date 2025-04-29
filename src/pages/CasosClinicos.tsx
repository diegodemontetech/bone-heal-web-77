
import React from 'react';
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import LeadsterChat from "@/components/LeadsterChat";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

const CasosClinicos = () => {
  const { data: studies, isLoading } = useQuery({
    queryKey: ["studies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scientific_studies")
        .select("*")
        .order("published_date", { ascending: false });
        
      if (error) {
        console.error("Erro ao buscar estudos:", error);
        throw error;
      }
      
      return data || [];
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Casos Clínicos | BoneHeal</title>
        <meta name="description" content="Conheça os casos clínicos e estudos científicos sobre os produtos BoneHeal para regeneração óssea guiada." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Casos Clínicos e Estudos</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Conheça os estudos científicos e casos clínicos que comprovam a eficácia dos nossos produtos.
            </p>
          </div>
        </section>
        
        <section className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studies && studies.length > 0 ? (
                studies.map((study) => (
                  <div key={study.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2 text-gray-800">{study.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Publicado em: {new Date(study.published_date).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-3">{study.description}</p>
                      <div className="mt-auto">
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center justify-center"
                          onClick={() => window.open(study.file_url, '_blank')}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Ver PDF</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full mt-2 text-primary flex items-center justify-center"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = study.file_url;
                            link.download = `${study.title.replace(/\s+/g, '_')}.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">
                    Nenhum estudo encontrado. Por favor, tente novamente mais tarde.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      
      <Footer />
      <WhatsAppWidget />
      <LeadsterChat 
        title="Dúvidas sobre casos clínicos?"
        message="Olá! Posso ajudar com informações sobre nossos estudos ou casos clínicos?"
      />
    </div>
  );
};

export default CasosClinicos;
