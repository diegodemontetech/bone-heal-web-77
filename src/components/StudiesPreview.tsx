import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Download, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const StudiesPreview = () => {
  const { data: studies } = useQuery({
    queryKey: ["studies-preview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scientific_studies")
        .select("*")
        .order("published_date", { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-primary mb-4">
            Estudos Científicos
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Descubra as evidências científicas que comprovam nossa eficácia
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {studies?.map((study) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-neutral-200"
            >
              <div className="p-6">
                <div className="flex items-center text-sm text-neutral-500 mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(new Date(study.published_date), "d 'de' MMMM, yyyy", { locale: ptBR })}
                </div>
                <h3 className="text-xl font-bold mb-4">{study.title}</h3>
                <p className="text-neutral-600 mb-6 line-clamp-3">
                  {study.description}
                </p>
                <div className="flex items-center justify-between">
                  <Link
                    to="/studies"
                    className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
                  >
                    Ver Detalhes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <a
                    href={study.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/studies"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
          >
            Ver Todos os Estudos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StudiesPreview;