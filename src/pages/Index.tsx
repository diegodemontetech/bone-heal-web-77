
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductsPreview from "@/components/ProductsPreview";
import NewsPreview from "@/components/NewsPreview";
import StudiesPreview from "@/components/StudiesPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const Index = () => {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <main className="w-full">
        <Hero />
        <Features />
        <ProductsPreview />
        <NewsPreview />
        <StudiesPreview />
        <Contact />
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Index;
