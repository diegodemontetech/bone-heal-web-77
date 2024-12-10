import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowDown, Brain, Microscope, Shield, Clock, Target, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Step = ({ title, description, icon: Icon, imageUrl, index }: {
  title: string;
  description: string;
  icon: any;
  imageUrl?: string;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="min-h-screen flex items-center justify-center py-24 px-4"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
          <p className="text-lg text-neutral-600 leading-relaxed mb-8">
            {description}
          </p>
          <div className="flex items-center text-sm text-primary">
            <span className="font-medium">Passo {index + 1}</span>
            <ChevronRight className="w-4 h-4 ml-2" />
          </div>
        </div>
        <div className="order-1 md:order-2 bg-neutral-100 rounded-2xl p-8 aspect-square flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
              <Icon className="w-16 h-16 text-primary" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const steps = [
  {
    title: "Preparação do Sítio Cirúrgico",
    description: "Após a remoção do dente, o alvéolo fica pronto para receber o processo de regeneração. É aqui que tudo começa.",
    icon: Brain
  },
  {
    title: "Formação do Coágulo Sanguíneo",
    description: "O coágulo rico em células é o alicerce da cicatrização. Ele fornece fatores de crescimento essenciais para a formação óssea.",
    icon: Microscope
  },
  {
    title: "Aplicação da Barreira Bone Heal®",
    description: "A membrana Bone Heal®, biocompatível e impermeável, é ajustada sobre o alvéolo, mantendo o coágulo protegido e impedindo a invasão de células não osteogênicas.",
    icon: Shield
  },
  {
    title: "Diferenciação Celular e Formação Óssea",
    description: "Sob a proteção da membrana, células mesenquimais se transformam em osteoblastos e formam a matriz óssea, garantindo estabilidade e volume.",
    icon: Microscope
  },
  {
    title: "Remoção Simples da Barreira",
    description: "Após alguns dias, a Bone Heal® é retirada sem cirurgia adicional. A área agora apresenta tecido de granulação e evolução favorável para formação óssea.",
    icon: Clock
  },
  {
    title: "Osso Regenerado e Reabilitação Segura",
    description: "Em poucas semanas, a regeneração óssea guiada com Bone Heal® restaura volume e qualidade do tecido, facilitando a futura instalação de implantes e reabilitação protética.",
    icon: Target
  }
];

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow" ref={containerRef}>
        {/* Hero Section */}
        <motion.section 
          style={{ opacity, scale }}
          className="relative h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-white"
        >
          <div className="container mx-auto px-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-primary mb-8"
            >
              Regeneração Óssea Guiada
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto mb-12"
            >
              Descubra como a Bone Heal revoluciona o processo de regeneração óssea através de uma tecnologia inovadora e minimamente invasiva.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="animate-bounce"
            >
              <ArrowDown className="w-12 h-12 text-primary mx-auto" />
            </motion.div>
          </div>
        </motion.section>

        {/* Steps */}
        {steps.map((step, index) => (
          <Step key={index} {...step} index={index} />
        ))}

        {/* Call to Action */}
        <section className="py-24 bg-primary text-white">
          <div className="container mx-auto px-8 text-center">
            <h2 className="text-4xl font-bold mb-8">
              Pronto para revolucionar seus procedimentos?
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              Descubra como a Bone Heal pode transformar seus procedimentos de regeneração óssea.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Conhecer Produtos
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                Ver Estudos Científicos
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;