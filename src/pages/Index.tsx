import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductsPreview from "@/components/ProductsPreview";
import NewsPreview from "@/components/NewsPreview";
import StudiesPreview from "@/components/StudiesPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <ProductsPreview />
      <NewsPreview />
      <StudiesPreview />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;