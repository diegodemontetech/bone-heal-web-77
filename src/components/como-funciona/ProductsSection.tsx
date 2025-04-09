
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Clock, Sparkles, Award, Star } from "lucide-react";

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
          
          <div className="flex items-center justify-center mt-6">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="h-6 w-6 text-yellow-400 fill-yellow-400" 
                />
              ))}
            </div>
            <span className="text-lg font-medium">5.0</span>
            <span className="text-gray-500 ml-2">(+90 avaliações de clientes)</span>
          </div>
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
                  src="/lovable-uploads/377e397a-d449-46aa-b4c2-c93a775ce41a.png" 
                  alt="Estrutura das Barreiras Bone Heal" 
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
                  100% impermeável, compatível com todos os sistemas de implantes, imediatos ou mediatos.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1"><Check size={18} /></span>
                    <div>
                      <p className="font-medium">Material</p>
                      <p className="text-gray-600">Polipropileno não absorvível 100% impermeável.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1"><Clock size={18} /></span>
                    <div>
                      <p className="font-medium">Técnica</p>
                      <p className="text-gray-600">Simples, sendo removida sem necessidade de anestesia e segunda cirurgia.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1"><Sparkles size={18} /></span>
                    <div>
                      <p className="font-medium">Benefícios exclusivos</p>
                      <p className="text-gray-600">Dispensa o uso de enxertos, biomateriais, parafusos ou qualquer artefato de fixação.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1"><Award size={18} /></span>
                    <div>
                      <p className="font-medium">Vantagens</p>
                      <p className="text-gray-600">Não adere aos tecidos, reduz a morbidade e aumenta o conforto pós-operatório.</p>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-semibold text-lg mb-3">Tamanhos disponíveis:</h4>
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
                  Registro ANVISA: 81197590000 | Validade: 5 anos
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
                  src="/lovable-uploads/377e397a-d449-46aa-b4c2-c93a775ce41a.png" 
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
                  Heal Bone® - Regeneração Óssea Eficaz
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Película biocompatível, não-reabsorvível, impermeável, constituída 100% por um filme de polipropileno.
                  Projetada para permanecer exposta ao meio bucal, sem porosidade em sua superfície.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1"><Check size={18} /></span>
                    <div>
                      <p className="font-medium">Solução completa</p>
                      <p className="text-gray-600">Utiliza apenas o coágulo sanguíneo, sem adição de enxertos ou implante de biomateriais.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1"><Clock size={18} /></span>
                    <div>
                      <p className="font-medium">Simplificação</p>
                      <p className="text-gray-600">Técnica cirúrgica simples, segura e previsível.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1"><Sparkles size={18} /></span>
                    <div>
                      <p className="font-medium">Principais vantagens</p>
                      <p className="text-gray-600">Elimina problemas de deiscência, reduz morbidade, aumenta conforto pós-operatório.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1"><Award size={18} /></span>
                    <div>
                      <p className="font-medium">Indicações</p>
                      <p className="text-gray-600">Todos os casos pós-exodontias, perda de parede alveolar, implantes imediatos e correção de fenestrações ósseas.</p>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-semibold text-lg mb-3">Tamanhos disponíveis:</h4>
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
                  Registro ANVISA: 81197590000 | Validade: 5 anos
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
