import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const steps = [
    {
      title: "Preparação do Sítio Cirúrgico",
      description: "Após a remoção do dente, o alvéolo fica pronto para receber o processo de regeneração. É aqui que tudo começa.",
      image: "/placeholder.svg" // Replace with actual image
    },
    {
      title: "Formação do Coágulo Sanguíneo",
      description: "O coágulo rico em células é o alicerce da cicatrização. Ele fornece fatores de crescimento essenciais para a formação óssea.",
      image: "/placeholder.svg" // Replace with actual image
    },
    {
      title: "Aplicação da Barreira Bone Heal®",
      description: "A membrana Bone Heal®, biocompatível e impermeável, é ajustada sobre o alvéolo, mantendo o coágulo protegido e impedindo a invasão de células não osteogênicas.",
      image: "/placeholder.svg" // Replace with actual image
    },
    {
      title: "Diferenciação Celular e Formação Óssea",
      description: "Sob a proteção da membrana, células mesenquimais se transformam em osteoblastos e formam a matriz óssea, garantindo estabilidade e volume.",
      image: "/placeholder.svg" // Replace with actual image
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center bg-primary text-white relative">
        <div className="container mx-auto px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-8"
          >
            Como Funciona o Bone Heal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 text-white/80"
          >
            Descubra o processo revolucionário de regeneração óssea guiada
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="animate-bounce absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <ArrowDown className="w-12 h-12" />
          </motion.div>
        </div>
      </section>

      {/* Scrolling Steps Section */}
      <div ref={containerRef} className="relative">
        {steps.map((step, index) => {
          const progress = useTransform(
            scrollYProgress,
            [index / steps.length, (index + 0.8) / steps.length],
            [0, 1]
          );

          const opacity = useTransform(
            scrollYProgress,
            [
              (index - 0.5) / steps.length,
              index / steps.length,
              (index + 0.8) / steps.length,
              (index + 1) / steps.length
            ],
            [0, 1, 1, 0]
          );

          return (
            <motion.section
              key={index}
              style={{ opacity }}
              className="h-screen sticky top-0 flex items-center justify-center overflow-hidden"
            >
              <div className="container mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  style={{ x: useTransform(progress, [0, 1], [-100, 0]) }}
                  className="space-y-6"
                >
                  <h2 className="text-4xl font-bold text-primary">
                    {step.title}
                  </h2>
                  <p className="text-lg text-neutral-600">
                    {step.description}
                  </p>
                </motion.div>
                <motion.div
                  style={{ x: useTransform(progress, [0, 1], [100, 0]) }}
                  className="relative aspect-square bg-neutral-100 rounded-2xl overflow-hidden"
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </motion.section>
          );
        })}
      </div>

      <Footer />
    </div>
  );
};

export default HowItWorks;
