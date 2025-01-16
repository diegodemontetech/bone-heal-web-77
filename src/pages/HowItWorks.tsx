import { useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform, useAnimation } from "framer-motion";
import { ChevronDown } from "lucide-react";
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
      if (videoRef.current && !isFinite(videoRef.current.duration)) {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const scrollPercentage = Math.min(
          Math.max(scrollPosition / windowHeight, 0),
          1
        );
        
        const targetTime = videoRef.current.duration * scrollPercentage;
        if (isFinite(targetTime) && targetTime >= 0) {
          videoRef.current.currentTime = targetTime;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const steps = [
    {
      title: "Preparação Inicial",
      description: "O processo começa com uma avaliação detalhada e preparação do local para o procedimento.",
      image: "1.webp"
    },
    {
      title: "Aplicação da Barreira",
      description: "A barreira Bone Heal® é cuidadosamente posicionada para proteger a área de regeneração.",
      image: "2.webp"
    },
    {
      title: "Proteção do Coágulo",
      description: "A membrana mantém o coágulo protegido, fundamental para o processo de regeneração.",
      image: "3.webp"
    },
    {
      title: "Regeneração Guiada",
      description: "O processo de regeneração óssea ocorre naturalmente sob a proteção da barreira.",
      image: "4.webp"
    },
    {
      title: "Formação Óssea",
      description: "Novo tecido ósseo se forma progressivamente na área protegida.",
      image: "5.webp"
    }
  ];

  const finalStep = {
    title: "Resultado Final",
    description: "Após o período de cicatrização, obtém-se um excelente resultado de regeneração.",
    image: "6.webp"
  };

  const getPublicUrl = (imageName: string) => {
    const { data: { publicUrl } } = supabase
      .storage
      .from('how_it_works_images')
      .getPublicUrl(imageName);
    return publicUrl;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Video Hero Section with Scroll Indicator */}
      <div className="h-screen relative overflow-hidden">
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="https://gflhpcvldqoqjikeepjh.supabase.co/storage/v1/object/public/videos/bone-heal-video.mp4"
          muted
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary-dark/90" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-center mb-8"
          >
            Como Funciona o Bone Heal
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.4, 1, 0.4],
              y: [0, 10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-12 flex flex-col items-center"
          >
            <span className="text-sm mb-2">Role para baixo</span>
            <ChevronDown size={32} className="animate-bounce" />
          </motion.div>
        </div>
      </div>

      {/* Scrolling Steps Section */}
      <div ref={containerRef} className="relative">
        {steps.map((step, index) => {
          const progress = useTransform(
            scrollYProgress,
            [index / (steps.length + 1), (index + 0.8) / (steps.length + 1)],
            [0, 1]
          );

          const opacity = useTransform(
            scrollYProgress,
            [
              (index - 0.5) / (steps.length + 1),
              index / (steps.length + 1),
              (index + 0.8) / (steps.length + 1),
              (index + 1) / (steps.length + 1)
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
                    src={getPublicUrl(step.image)}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </motion.section>
          );
        })}

        {/* Final Step - Sticky at the end */}
        <motion.section
          style={{
            opacity: useTransform(
              scrollYProgress,
              [0.8, 0.9],
              [0, 1]
            )
          }}
          className="h-screen sticky top-0 flex items-center justify-center overflow-hidden bg-white"
        >
          <div className="container mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-primary font-semibold">
                Resultado Final
              </span>
              <h2 className="text-4xl font-bold text-primary">
                {finalStep.title}
              </h2>
              <p className="text-lg text-neutral-600">
                {finalStep.description}
              </p>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={getPublicUrl(finalStep.image)}
                alt={finalStep.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
};

export default HowItWorks;