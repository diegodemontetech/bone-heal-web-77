import Navbar from "@/components/Navbar";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Sobre Nós</h1>
        <div className="prose max-w-none">
          {/* Content will be added here */}
        </div>
      </div>
    </div>
  );
};

export default About;