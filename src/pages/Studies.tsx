import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";

const Studies = () => {
  const { data: studies, isLoading } = useQuery({
    queryKey: ['scientific-studies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scientific_studies')
        .select('*')
        .order('published_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="pt-24">
          <div className="relative h-[400px] bg-primary">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-primary/90" />
            <div className="container mx-auto px-8 h-full flex items-center">
              <div className="relative z-10 max-w-3xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Estudos Científicos
                </h1>
                <p className="text-lg md:text-xl text-white/90">
                  Descubra as pesquisas e evidências científicas que comprovam a eficácia dos nossos produtos.
                </p>
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-8 py-16">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {studies?.map((study) => (
                  <div key={study.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-primary mb-3">{study.title}</h3>
                      <p className="text-neutral-600 mb-4 line-clamp-3">{study.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-neutral-500">
                          {study.published_date && new Date(study.published_date).toLocaleDateString('pt-BR')}
                        </div>
                        <a 
                          href={study.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download PDF</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Studies;