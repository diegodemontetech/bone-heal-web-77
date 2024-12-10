import { useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform, useAnimation } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controls = useAnimation();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current) {
        const scrollPercent = window.scrollY / (window.innerHeight * 0.5);
        videoRef.current.currentTime = Math.min(
          videoRef.current.duration * scrollPercent,
          videoRef.current.duration
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const steps = [
    {
      title: "Preparação Inicial",
      description: "O processo começa com uma avaliação detalhada e preparação do local para o procedimento.",
      image: "1"
    },
    {
      title: "Aplicação da Barreira",
      description: "A barreira Bone Heal® é cuidadosamente posicionada para proteger a área de regeneração.",
      image: "2"
    },
    {
      title: "Proteção do Coágulo",
      description: "A membrana mantém o coágulo protegido, fundamental para o processo de regeneração.",
      image: "3"
    },
    {
      title: "Regeneração Guiada",
      description: "O processo de regeneração óssea ocorre naturalmente sob a proteção da barreira.",
      image: "4"
    },
    {
      title: "Formação Óssea",
      description: "Novo tecido ósseo se forma progressivamente na área protegida.",
      image: "5"
    },
    {
      title: "Resultado Final",
      description: "Após o período de cicatrização, obtém-se um excelente resultado de regeneração.",
      image: "6"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Video Hero Section */}
      <div className="h-screen relative overflow-hidden">
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="https://gflhpcvldqoqjikeepjh.supabase.co/storage/v1/object/public/videos/bone-heal-video.mp4"
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-center"
          >
            Como Funciona o Bone Heal
          </motion.h1>
        </div>
      </div>

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
                  <span className="text-primary font-semibold">
                    Passo {index + 1}
                  </span>
                  <h2 className="text-4xl font-bold text-primary">
                    {step.title}
                  </h2>
                  <p className="text-lg text-neutral-600">
                    {step.description}
                  </p>
                </motion.div>
                <motion.div
                  style={{ x: useTransform(progress, [0, 1], [100, 0]) }}
                  className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={`https://gflhpcvldqoqjikeepjh.supabase.co/storage/v1/object/public/fotos/${step.image}`}
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