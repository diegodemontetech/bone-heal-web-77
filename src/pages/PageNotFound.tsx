
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Home } from "lucide-react";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-6">Página Não Encontrada</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            A página que você está procurando não existe ou foi removida.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => window.history.back()} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Link to="/">
              <Button className="bg-primary">
                <Home className="mr-2 h-4 w-4" />
                Página Inicial
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PageNotFound;
