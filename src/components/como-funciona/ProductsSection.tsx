
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Clock, Sparkles, Award } from "lucide-react";

const ProductsSection = () => {
  return (
    <section id="products" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Produtos Bone Heal
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
            Conheça Nossas Barreiras para ROG
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Soluções desenvolvidas com tecnologia exclusiva para regeneração óssea guiada com resultados superiores
          </p>
        </div>
        
        <Tabs defaultValue="bone-heal" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="bone-heal">Bone Heal®</TabsTrigger>
            <TabsTrigger value="heal-bone">Heal Bone®</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bone-heal" className="mt-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img 
                  src="https://i.ibb.co/5rhwywJ/6.webp" 
                  alt="Bone Heal" 
                  className="rounded-xl shadow-lg"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-primary">
                  Bone Heal® - A Barreira Premium para ROG
                </h3>
                
                <p className="text-gray-600 mb-6">
                  A barreira premium de polipropileno não absorvível para regeneração óssea guiada, 
                  proporcionando excelente formação óssea sem utilização de biomateriais e membranas.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1"><Check size={18} /></span>
                    <div>
                      <p className="font-medium">Material</p>
                      <p className="text-gray-600">Polipropileno não absorvível de alta qualidade.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1"><Clock size={18} /></span>
                    <div>
                      <p className="font-medium">Tempo de instalação</p>
                      <p className="text-gray-600">7 a 10 dias, ideal para casos mais complexos.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1"><Sparkles size={18} /></span>
                    <div>
                      <p className="font-medium">Benefícios exclusivos</p>
                      <p className="text-gray-600">Regeneração óssea guiada sem enxertos e biomateriais, com formação de tecido queratinizado em única fase.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1"><Award size={18} /></span>
                    <div>
                      <p className="font-medium">Indicações</p>
                      <p className="text-gray-600">Defeitos ósseos horizontais e verticais, preservação alveolar, ROG em implante imediato.</p>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-semibold text-lg mb-3">Formatos disponíveis:</h4>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Card className="p-4 text-center">
                    <p className="font-bold text-primary">15x40mm</p>
                    <p className="text-sm">Exodontias unitárias</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="font-bold text-primary">20x30mm</p>
                    <p className="text-sm">Até 2 elementos contíguos</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="font-bold text-primary">30x40mm</p>
                    <p className="text-sm">Até 3 elementos contíguos</p>
                  </Card>
                </div>
                
                <div className="text-xs text-gray-500 mb-6">
                  Registro ANVISA: 80117580025 | Validade: 5 anos
                </div>
                
                <Button asChild>
                  <Link to="/products">Ver Produtos Bone Heal®</Link>
                </Button>
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="heal-bone" className="mt-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img 
                  src="https://i.ibb.co/X277PPz/4.webp" 
                  alt="Heal Bone" 
                  className="rounded-xl shadow-lg"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-primary">
                  Heal Bone® - A ROG Acessível e Eficaz
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Barreira de polipropileno não absorvível para regeneração óssea guiada, ideal para preservação 
                  alveolar e defeitos ósseos de pequena e média extensão.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1"><Check size={18} /></span>
                    <div>
                      <p className="font-medium">Material</p>
                      <p className="text-gray-600">Polipropileno não absorvível.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1"><Clock size={18} /></span>
                    <div>
                      <p className="font-medium">Tempo de instalação</p>
                      <p className="text-gray-600">7 a 10 dias, ideal para casos convencionais.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1"><Sparkles size={18} /></span>
                    <div>
                      <p className="font-medium">Benefícios</p>
                      <p className="text-gray-600">Acessibilidade, eficácia, simplicidade de manuseio, regeneração sem enxertos.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1"><Award size={18} /></span>
                    <div>
                      <p className="font-medium">Indicação</p>
                      <p className="text-gray-600">Preservação alveolar, correção de defeitos ósseos pequenos e médios.</p>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-semibold text-lg mb-3">Formatos disponíveis:</h4>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Card className="p-4 text-center">
                    <p className="font-bold text-primary">15x40mm</p>
                    <p className="text-sm">Exodontias unitárias</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="font-bold text-primary">20x30mm</p>
                    <p className="text-sm">Até 2 elementos contíguos</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="font-bold text-primary">30x40mm</p>
                    <p className="text-sm">Até 3 elementos contíguos</p>
                  </Card>
                </div>
                
                <div className="text-xs text-gray-500 mb-6">
                  Registro ANVISA: 80117580018 | Validade: 5 anos
                </div>
                
                <Button asChild>
                  <Link to="/products">Ver Produtos Heal Bone®</Link>
                </Button>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ProductsSection;
