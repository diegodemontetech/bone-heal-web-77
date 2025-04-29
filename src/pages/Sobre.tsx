
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadsterChat from "@/components/LeadsterChat";

const Sobre = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Sobre a BoneHeal</title>
        <meta name="description" content="Conheça a história e missão da BoneHeal, referência em tecnologias para regeneração óssea guiada." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Sobre a BoneHeal</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Revolucionando a regeneração óssea na odontologia
            </p>
          </div>
        </section>
        
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Nossa História</h2>
              <p className="text-lg leading-relaxed mb-4">
                A BoneHeal nasceu da visão de profissionais experientes e apaixonados pela odontologia, 
                motivados pela necessidade de simplificar e otimizar os procedimentos de regeneração óssea guiada.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Fundada em 2015, a empresa tem se destacado pelo desenvolvimento de tecnologias inovadoras que
                simplificam procedimentos cirúrgicos e melhoram significativamente os resultados clínicos.
              </p>
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Nossa Missão</h2>
              <p className="text-lg leading-relaxed mb-4">
                Desenvolver e fornecer soluções inovadoras e de alta qualidade para regeneração óssea guiada,
                que simplificam o trabalho dos profissionais e proporcionam melhores resultados aos pacientes.
              </p>
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Nossos Valores</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-primary">Inovação</h3>
                  <p>Buscamos constantemente novas tecnologias e métodos para aprimorar nossos produtos.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-primary">Excelência</h3>
                  <p>Comprometimento com a qualidade e eficácia de cada produto que desenvolvemos.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-primary">Simplicidade</h3>
                  <p>Acreditamos que as melhores soluções são aquelas que simplificam o trabalho do profissional.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-primary">Responsabilidade</h3>
                  <p>Assumimos total responsabilidade pela qualidade e segurança de nossos produtos.</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4">Compromisso com a Qualidade</h2>
              <p className="text-lg leading-relaxed mb-4">
                Todos os nossos produtos são desenvolvidos seguindo rigorosos padrões de qualidade e segurança,
                com certificações nacionais e internacionais que atestam nossa excelência.
              </p>
              <p className="text-lg leading-relaxed">
                A BoneHeal continua investindo em pesquisa e desenvolvimento para oferecer sempre as melhores
                soluções em regeneração óssea guiada para profissionais e pacientes.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <LeadsterChat 
        title="Fale com a BoneHeal"
        message="Olá! Gostaria de conhecer mais sobre a BoneHeal e nossos produtos?"
      />
    </div>
  );
};

export default Sobre;
