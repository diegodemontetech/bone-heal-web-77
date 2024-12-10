import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Products = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-8">
          <h1 className="text-4xl font-bold mb-8">Produtos</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product cards will be added here */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;