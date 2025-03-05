
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, Loader2, Download, FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Studies = () => {
  const { data: studies, isLoading, error } = useQuery({
    queryKey: ["studies"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("scientific_studies")
          .select("*")
          .order("published_date", { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Erro ao buscar estudos:", err);
        throw err;
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>Estudos Científicos | Boneheal</title>
        <meta name="description" content="Conheça os estudos científicos que comprovam a eficácia dos produtos Boneheal." />
      </Helmet>

      <div className="bg-gradient-to-b from-primary/10 to-background py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-primary mb-6"
          >
            Estudos Científicos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-neutral-700 max-w-2xl mx-auto"
          >
            Descubra as evidências científicas que comprovam a eficácia de nossos produtos e soluções na odontologia.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Não foi possível carregar os estudos científicos. Por favor, tente novamente mais tarde.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
            <span className="text-lg">Carregando estudos...</span>
          </div>
        ) : studies && studies.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studies.map((study) => (
              <Card key={study.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-primary/5">
                  <div className="text-sm text-neutral-500 mb-2">
                    {format(new Date(study.published_date), "d 'de' MMMM, yyyy", { locale: ptBR })}
                  </div>
                  <CardTitle className="text-xl">{study.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-neutral-600 mb-6">{study.description}</p>
                  {study.file_url ? (
                    <a
                      href={study.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      <Button variant="outline" className="gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Visualizar PDF</span>
                      </Button>
                    </a>
                  ) : (
                    <p className="text-neutral-400 text-sm italic">Documento indisponível</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-neutral-500">Nenhum estudo científico disponível no momento.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Studies;
