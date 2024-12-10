import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-8">
          <h1 className="text-4xl font-bold mb-8">Sobre Nós</h1>
          <div className="prose max-w-none">
            {/* Content will be added here */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;