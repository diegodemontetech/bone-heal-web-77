import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Studies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="pt-24"> {/* Added padding-top to account for fixed navbar */}
          <div className="relative h-[400px] bg-primary">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-primary/90" />
            <div className="container mx-auto px-8 h-full flex items-center">
              <div className="relative z-10 max-w-3xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Estudos Científicos
                </h1>
                <p className="text-lg md:text-xl text-white/90">
                  Descubra as pesquisas e evidências científicas que comprovam a eficácia dos nossos produtos.
                </p>
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-8 py-16">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Study cards will be added here */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Studies;