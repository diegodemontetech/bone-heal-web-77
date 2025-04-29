
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadsterChat from "@/components/LeadsterChat";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Produtos = () => {
  const products = [
    {
      id: 1,
      slug: "bone-heal-15x40",
      name: "Bone Heal 15x40",
      description: "Barreira de polipropileno não absorvível 100% impermeável para regeneração óssea guiada.",
      image: "https://boneheal.com.br/wp-content/uploads/2023/05/bone-heal-15x40.jpg",
      dimensions: "15mm x 40mm",
      indication: "Exodontia unitária"
    },
    {
      id: 2,
      slug: "bone-heal-20x30",
      name: "Bone Heal 20x30",
      description: "Barreira de polipropileno não absorvível 100% impermeável para regeneração óssea guiada.",
      image: "https://boneheal.com.br/wp-content/uploads/2023/05/bone-heal-20x30.jpg",
      dimensions: "20mm x 30mm",
      indication: "Até 2 elementos contíguos"
    },
    {
      id: 3,
      slug: "bone-heal-30x40",
      name: "Bone Heal 30x40",
      description: "Barreira de polipropileno não absorvível 100% impermeável para regeneração óssea guiada.",
      image: "https://boneheal.com.br/wp-content/uploads/2023/05/bone-heal-30x40.jpg",
      dimensions: "30mm x 40mm",
      indication: "Até 3 elementos contíguos"
    },
    {
      id: 4,
      slug: "heal-bone-15x40",
      name: "Heal Bone 15x40",
      description: "Película biocompatível 100% em polipropileno projetada para permanecer exposta ao meio bucal.",
      image: "https://boneheal.com.br/wp-content/uploads/2023/05/heal-bone-15x40.jpg",
      dimensions: "15mm x 40mm",
      indication: "Exodontia unitária"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Produtos | BoneHeal</title>
        <meta name="description" content="Conheça a linha completa de produtos BoneHeal para regeneração óssea guiada na Odontologia." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Produtos</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Dispositivos médicos implantáveis de polipropileno para Regeneração Óssea Guiada na Odontologia.
            </p>
          </div>
        </section>
        
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden flex flex-col h-full">
                <div className="aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                </div>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {product.dimensions}
                    </span>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                      {product.indication}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 flex-grow">{product.description}</p>
                  <div className="mt-auto">
                    <Button asChild className="w-full">
                      <Link to={`/produtos/${product.slug}`}>Ver detalhes</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
      <LeadsterChat 
        title="Dúvidas sobre nossos produtos?"
        message="Olá! Posso ajudar você a escolher o produto BoneHeal ideal para o seu procedimento?"
      />
    </div>
  );
};

export default Produtos;
