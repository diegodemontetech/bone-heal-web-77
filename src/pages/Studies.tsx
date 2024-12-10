import Navbar from "@/components/Navbar";

const Studies = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Estudos Científicos</h1>
        <div className="grid gap-8">
          {/* Studies will be added here */}
        </div>
      </div>
    </div>
  );
};

export default Studies;