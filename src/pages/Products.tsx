import Navbar from "@/components/Navbar";

const Products = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Produtos</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Product cards will be added here */}
        </div>
      </div>
    </div>
  );
};

export default Products;