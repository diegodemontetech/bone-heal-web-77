
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone } from "lucide-react";
import { Product } from "@/types/product";
import HealBoneTechDetails from "./tech-details/HealBoneTechDetails";
import WhatsAppButton from "../WhatsAppButton";

interface ProductLandingPageProps {
  product: Product;
}

const ProductLandingPage = ({ product }: ProductLandingPageProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary">
              {product.name}
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              {product.short_description || "Solução avançada para regeneração óssea e tecidual"}
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center">
                <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                  Registro ANVISA
                </span>
                <span className="text-gray-600">81197590000</span>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                  Biomaterial
                </span>
                <span className="text-gray-600">100% Biocompatível</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => {
                  // Simulating contact form popup or scroll to contact
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Entre em Contato
              </Button>
              <WhatsAppButton text={`Olá, gostaria de informações sobre ${product.name}`} />
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src={product.image_url || "/product-placeholder.png"} 
              alt={product.name}
              className="rounded-lg shadow-lg w-full object-cover max-h-[400px]"
            />
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <HealBoneTechDetails 
            dimensions={product.dimensions || "20 x 30"} 
            indication={product.indication || ""}
          />
        </div>
        
        <div className="space-y-8">
          {/* Clinical Cases Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="font-medium text-lg">Casos Clínicos</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-700 mb-4">
                Veja exemplos de casos clínicos realizados com {product.name}
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open("/estudos", "_self")}
              >
                Ver Casos Clínicos
              </Button>
            </div>
          </div>
          
          {/* Contact Card */}
          <div id="contact" className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="font-medium text-lg">Fale Conosco</h3>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-gray-700">
                Entre em contato com nossa equipe para obter mais informações sobre este produto.
              </p>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <a href="tel:+551143264252" className="text-primary hover:underline">
                  (11) 4326-4252
                </a>
              </div>
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  onClick={() => window.open("/contato", "_self")}
                >
                  Formulário de Contato
                </Button>
                <WhatsAppButton text={`Olá, gostaria de informações sobre ${product.name}`} className="flex-1" />
              </div>
            </div>
          </div>
          
          {/* Download Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="font-medium text-lg">Materiais Técnicos</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-700 mb-4">
                Baixe o catálogo completo, manual de instruções e mais
              </p>
              <Button 
                variant="outline" 
                className="w-full"
              >
                Baixar PDFs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductLandingPage;
