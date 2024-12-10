import Navbar from "@/components/Navbar";

const Cart = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Carrinho</h1>
        <div>
          {/* Cart items will be added here */}
        </div>
      </div>
    </div>
  );
};

export default Cart;