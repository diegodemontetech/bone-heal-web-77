
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AutoChat from "@/components/AutoChat";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/5 to-primary/20 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">Sobre a Bone Heal</h1>
            <p className="text-lg max-w-3xl mx-auto text-gray-700">
              Somos especialistas em soluções avançadas para regeneração óssea com mais de 15 anos de experiência no mercado odontológico.
            </p>
          </div>
        </section>

        {/* Mission and Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <h3 className="text-2xl font-bold mb-4 text-primary">Missão</h3>
                <p className="text-gray-700">
                  Desenvolver e fornecer produtos de alta qualidade para regeneração óssea, contribuindo para o sucesso de procedimentos odontológicos e melhorando a qualidade de vida dos pacientes.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <h3 className="text-2xl font-bold mb-4 text-primary">Visão</h3>
                <p className="text-gray-700">
                  Ser referência mundial em soluções inovadoras para regeneração óssea, sempre comprometidos com a excelência e o avanço científico.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <h3 className="text-2xl font-bold mb-4 text-primary">Valores</h3>
                <p className="text-gray-700">
                  Inovação, qualidade, ética, excelência científica e compromisso com a saúde dos pacientes são os valores que norteiam todas as nossas ações.
                </p>
              </div>
            </div>

            {/* Company Story */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-6">Nossa História</h2>
                <p className="text-gray-700 mb-4">
                  A Bone Heal foi fundada em 2008 pelo Prof. Dr. Munir Salomão, um renomado especialista em implantodontia, com o objetivo de desenvolver soluções inovadoras para os desafios da regeneração óssea na área odontológica.
                </p>
                <p className="text-gray-700 mb-4">
                  Após anos de pesquisa e desenvolvimento, a empresa lançou seu primeiro produto, a membrana Heal Bone, que revolucionou o mercado ao oferecer uma solução simples e eficiente para regeneração óssea guiada.
                </p>
                <p className="text-gray-700">
                  Hoje, a Bone Heal possui uma linha completa de produtos para regeneração óssea e tecidual, todos desenvolvidos com base em rigorosos estudos científicos e com a mais alta qualidade.
                </p>
              </div>
              <div>
                <img 
                  src="/about-image.jpg" 
                  alt="Equipe Bone Heal"
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>

            {/* Timeline */}
            <h2 className="text-3xl font-bold mb-8 text-center">Nossa Trajetória</h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>
              
              <div className="grid grid-cols-1 gap-16">
                <div className="relative flex items-center">
                  <div className="flex flex-col md:flex-row items-center w-full">
                    <div className="md:w-1/2 md:pr-8 md:text-right mb-4 md:mb-0">
                      <h3 className="font-bold text-xl text-primary">2008</h3>
                      <p>Fundação da Bone Heal pelo Prof. Dr. Munir Salomão</p>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                    <div className="md:w-1/2 md:pl-8"></div>
                  </div>
                </div>
                
                <div className="relative flex items-center">
                  <div className="flex flex-col md:flex-row items-center w-full">
                    <div className="md:w-1/2 md:pr-8 md:text-right"></div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                    <div className="md:w-1/2 md:pl-8 mb-4 md:mb-0">
                      <h3 className="font-bold text-xl text-primary">2010</h3>
                      <p>Lançamento da primeira membrana Heal Bone</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative flex items-center">
                  <div className="flex flex-col md:flex-row items-center w-full">
                    <div className="md:w-1/2 md:pr-8 md:text-right mb-4 md:mb-0">
                      <h3 className="font-bold text-xl text-primary">2015</h3>
                      <p>Expansão da linha de produtos e registro ANVISA</p>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                    <div className="md:w-1/2 md:pl-8"></div>
                  </div>
                </div>
                
                <div className="relative flex items-center">
                  <div className="flex flex-col md:flex-row items-center w-full">
                    <div className="md:w-1/2 md:pr-8 md:text-right"></div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                    <div className="md:w-1/2 md:pl-8 mb-4 md:mb-0">
                      <h3 className="font-bold text-xl text-primary">2020</h3>
                      <p>Publicação de estudos clínicos internacionais</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative flex items-center">
                  <div className="flex flex-col md:flex-row items-center w-full">
                    <div className="md:w-1/2 md:pr-8 md:text-right mb-4 md:mb-0">
                      <h3 className="font-bold text-xl text-primary">2023</h3>
                      <p>Expansão para o mercado internacional</p>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                    <div className="md:w-1/2 md:pl-8"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Descubra nossas soluções inovadoras
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Conheça nossa linha completa de produtos para regeneração óssea e tecidual
            </p>
            <Link to="/produtos">
              <Button className="bg-white text-primary hover:bg-gray-100">
                Ver Produtos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <AutoChat />
    </div>
  );
};

export default AboutPage;
