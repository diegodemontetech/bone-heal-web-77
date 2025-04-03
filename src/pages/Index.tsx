
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductsPreview from "@/components/ProductsPreview";
import Recognition from "@/components/Recognition";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import Testimonials from "@/components/Testimonials";
import StudiesPreview from "@/components/StudiesPreview";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>BoneHeal | Regeneração Óssea Guiada</title>
        <meta name="description" content="A BoneHeal é referência em dispositivos médicos implantáveis de polipropileno para Regeneração Óssea Guiada na Odontologia." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        <ProductsPreview />
        <Recognition />
        <StudiesPreview />
        <Testimonials />
        <CallToAction />
      </main>
      
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Index;
