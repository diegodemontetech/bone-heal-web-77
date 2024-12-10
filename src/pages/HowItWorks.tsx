import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Brain, Microscope, Flask, Activity } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0.8, 0.8, 0]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24" ref={containerRef}>
        {/* Hero Section */}
        <motion.section 
          style={{ scale, opacity }}
          className="relative h-[90vh] flex items-center justify-center bg-gradient-to-b from-primary/10 to-white"
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

        {/* Process Timeline */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-8">
            <div className="max-w-5xl mx-auto space-y-32">
              {/* Step 1: Overview */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="grid md:grid-cols-2 gap-12 items-center"
              >
                <div>
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-6">Visão Geral do Processo</h2>
                  <p className="text-lg text-neutral-600 leading-relaxed mb-8">
                    A técnica consiste em isolar a área com a película de polipropileno Bone Heal, 
                    criando o ambiente ideal para o crescimento natural do tecido ósseo.
                  </p>
                  <Button variant="outline" size="lg" className="group">
                    Saiba mais sobre o processo
                    <ArrowDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
                  </Button>
                </div>
                <div className="bg-neutral-100 rounded-2xl p-8 aspect-square flex items-center justify-center">
                  <Canvas>
                    <OrbitControls enableZoom={false} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    {/* Add your 3D model here */}
                    <mesh>
                      <boxGeometry args={[1, 1, 1]} />
                      <meshStandardMaterial color="#8B1F41" />
                    </mesh>
                  </Canvas>
                </div>
              </motion.div>

              {/* Step 2: Microscopic View */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="grid md:grid-cols-2 gap-12 items-center md:grid-flow-row-dense"
              >
                <div className="bg-neutral-100 rounded-2xl p-8 aspect-square flex items-center justify-center md:order-1">
                  <Microscope className="w-32 h-32 text-primary" />
                </div>
                <div>
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                    <Flask className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-6">Nível Microscópico</h2>
                  <p className="text-lg text-neutral-600 leading-relaxed mb-8">
                    Em nível microscópico, a película cria um isolamento perfeito, 
                    mantendo o espaço necessário para o crescimento ósseo natural.
                  </p>
                  <Button variant="outline" size="lg" className="group">
                    Explorar mais
                    <Activity className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>

              {/* Additional steps will be added here */}
            </div>
          </div>
        </section>

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