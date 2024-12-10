import Navbar from "@/components/Navbar";

const HowItWorks = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Como Funciona</h1>
        <div className="prose max-w-none">
          {/* Content will be added here */}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;