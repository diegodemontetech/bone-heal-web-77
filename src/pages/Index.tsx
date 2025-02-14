
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductsPreview from "@/components/ProductsPreview";
import Recognition from "@/components/Recognition";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import StudiesPreview from "@/components/StudiesPreview";
import NewsPreview from "@/components/NewsPreview";

const Index = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <ProductsPreview />
      <StudiesPreview />
      <Recognition />
      <NewsPreview />
      <CallToAction />
      <Footer />
    </>
  );
};

export default Index;
