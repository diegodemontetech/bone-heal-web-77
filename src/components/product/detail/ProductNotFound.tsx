
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ProductNotFoundProps {
  onNavigateBack: () => void;
}

const ProductNotFound = ({ onNavigateBack }: ProductNotFoundProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <p className="mb-6 text-gray-600">
            O produto que você está buscando não foi encontrado ou pode ter sido removido.
          </p>
          <Button onClick={onNavigateBack}>
            Ver todos os produtos
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductNotFound;
