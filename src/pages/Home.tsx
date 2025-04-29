
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadsterChat from "@/components/LeadsterChat";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>BoneHeal | Regeneração Óssea Guiada</title>
        <meta name="description" content="A BoneHeal é referência em dispositivos médicos implantáveis de polipropileno para Regeneração Óssea Guiada na Odontologia." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-20 md:py-32">
          <div className="container mx-auto px-4 flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Revolucionando a Regeneração Óssea</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10">
              Dispositivos médicos implantáveis de polipropileno para Regeneração Óssea Guiada na Odontologia.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link to="/produtos">Conheça nossos produtos</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/como-funciona">Saiba como funciona</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Por que usar BoneHeal?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Técnica simplificada</h3>
                <p className="text-gray-600">
                  Dispensa o uso de biomateriais, enxertos e parafusos, simplificando o procedimento.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">100% impermeável</h3>
                <p className="text-gray-600">
                  Barreira de polipropileno não absorvível que impede a invasão de tecido mole.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Menor morbidade</h3>
                <p className="text-gray-600">
                  Não adere aos tecidos, facilitando a remoção e reduzindo o desconforto do paciente.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Compatível com implantes</h3>
                <p className="text-gray-600">
                  Pode ser utilizado com todos os sistemas de implantes disponíveis no mercado.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Excelentes resultados</h3>
                <p className="text-gray-600">
                  Resultados clínicos comprovados em regeneração óssea guiada.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Registrado na ANVISA</h3>
                <p className="text-gray-600">
                  Produto com registro na ANVISA, garantindo qualidade e segurança.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Products Preview */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Nossos Produtos</h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Conheça nossa linha completa de produtos para regeneração óssea guiada
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="p-6 bg-gray-50">
                  <img 
                    src="https://boneheal.com.br/wp-content/uploads/2023/05/bone-heal-produto.jpg"
                    alt="Bone Heal"
                    className="w-full h-48 object-contain"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Bone Heal</h3>
                  <p className="text-gray-600 mb-4">
                    Barreira de polipropileno não absorvível 100% impermeável para regeneração óssea guiada.
                  </p>
                  <Button asChild>
                    <Link to="/produtos">Ver detalhes</Link>
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="p-6 bg-gray-50">
                  <img 
                    src="https://boneheal.com.br/wp-content/uploads/2023/05/heal-bone-produto.jpg"
                    alt="Heal Bone"
                    className="w-full h-48 object-contain"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">Heal Bone</h3>
                  <p className="text-gray-600 mb-4">
                    Película biocompatível 100% em polipropileno projetada para permanecer exposta ao meio bucal.
                  </p>
                  <Button asChild>
                    <Link to="/produtos">Ver detalhes</Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" asChild>
                <Link to="/produtos">Ver todos os produtos</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Cases Preview */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Casos Clínicos</h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Conheça casos reais de uso das soluções BoneHeal
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://boneheal.com.br/wp-content/uploads/2023/05/caso-clinico-1.jpg"
                  alt="Caso Clínico 1"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-1">Regeneração pós-extração</h3>
                  <p className="text-sm text-gray-600">Acompanhamento de 3 meses</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://boneheal.com.br/wp-content/uploads/2023/05/caso-clinico-2.jpg"
                  alt="Caso Clínico 2"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-1">Grande defeito ósseo</h3>
                  <p className="text-sm text-gray-600">Acompanhamento de 6 meses</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://boneheal.com.br/wp-content/uploads/2023/05/caso-clinico-3.jpg"
                  alt="Caso Clínico 3"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-1">ROG com implante imediato</h3>
                  <p className="text-sm text-gray-600">Acompanhamento de 4 meses</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Button variant="outline" asChild>
                <Link to="/casos-clinicos">Ver todos os casos</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Pronto para revolucionar seus procedimentos?</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Entre em contato conosco e descubra como a BoneHeal pode transformar seus procedimentos de regeneração óssea.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link to="/contato">Fale conosco</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/produtos">Conhecer produtos</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <LeadsterChat 
        title="Como posso ajudar?"
        message="Olá! Sou um especialista da BoneHeal. Tem alguma dúvida sobre nossos produtos de regeneração óssea?"
      />
    </div>
  );
};

export default Home;
