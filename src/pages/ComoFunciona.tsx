
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import HeroSection from "@/components/como-funciona/HeroSection";
import RegeneracaoOsseaSection from "@/components/como-funciona/RegeneracaoOsseaSection";
import ProcessoSection from "@/components/como-funciona/ProcessoSection";
import BeneficiosSection from "@/components/como-funciona/BeneficiosSection";
import FaqSection from "@/components/como-funciona/FaqSection";
import CtaSection from "@/components/como-funciona/CtaSection";

const ComoFunciona = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Como Funciona a Regeneração Óssea | BoneHeal</title>
        <meta name="description" content="Entenda como a membrana BoneHeal funciona no processo de regeneração óssea guiada na odontologia." />
      </Helmet>
      
      <Navbar />
      <HeroSection />
      <RegeneracaoOsseaSection />
      <ProcessoSection />
      <BeneficiosSection />
      <FaqSection />
      <CtaSection />
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default ComoFunciona;
