
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import BoneHealHero from "@/components/como-funciona/BoneHealHero";
import ProductsSection from "@/components/como-funciona/ProductsSection";
import ApplicationTechniqueSection from "@/components/como-funciona/ApplicationTechniqueSection";
import BenefitsSection from "@/components/como-funciona/BenefitsSection";
import ContactSection from "@/components/contact/ContactSection";
import HowItWorks from "@/components/HowItWorks";
import ProcessoSection from "@/components/como-funciona/ProcessoSection";

const ComoFunciona = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Barreiras para Regeneração Óssea Guiada | BoneHeal</title>
        <meta 
          name="description" 
          content="Conheça as barreiras Bone Heal® e Heal Bone® para regeneração óssea guiada (ROG) na odontologia. Soluções inovadoras com alta previsibilidade e versatilidade." 
        />
      </Helmet>
      
      <Navbar />
      <BoneHealHero />
      <ProductsSection />
      <HowItWorks />
      <ProcessoSection />
      <ApplicationTechniqueSection />
      <BenefitsSection />
      <ContactSection />
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default ComoFunciona;
