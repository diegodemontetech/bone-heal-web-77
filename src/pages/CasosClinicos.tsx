
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadsterChat from "@/components/LeadsterChat";
import { Card, CardContent } from "@/components/ui/card";

const CasosClinicos = () => {
  const cases = [
    {
      id: 1,
      title: "Regeneração óssea após exodontia",
      description: "Caso clínico demonstrando regeneração óssea guiada após exodontia utilizando membrana Bone Heal.",
      image: "https://boneheal.com.br/wp-content/uploads/2023/05/caso-clinico-1.jpg"
    },
    {
      id: 2,
      title: "Reconstrução de grande defeito ósseo",
      description: "Reconstrução de defeito ósseo de grande proporção utilizando técnica avançada.",
      image: "https://boneheal.com.br/wp-content/uploads/2023/05/caso-clinico-2.jpg"
    },
    {
      id: 3,
      title: "Preservação alveolar pós-extração",
      description: "Técnica de preservação alveolar após extração dentária com resultados após 6 meses.",
      image: "https://boneheal.com.br/wp-content/uploads/2023/05/caso-clinico-3.jpg"
    },
    {
      id: 4,
      title: "Regeneração com a técnica Bone Heal",
      description: "Utilização da membrana Bone Heal em defeito ósseo vestibular com acompanhamento de 12 meses.",
      image: "https://boneheal.com.br/wp-content/uploads/2023/05/caso-clinico-4.jpg"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Casos Clínicos | BoneHeal</title>
        <meta name="description" content="Conheça casos clínicos de sucesso com uso das membranas BoneHeal para regeneração óssea guiada." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Casos Clínicos</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Conheça casos reais de profissionais que já utilizam as tecnologias BoneHeal em seus procedimentos.
            </p>
          </div>
        </section>
        
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {cases.map((c) => (
              <Card key={c.id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={c.image} 
                    alt={c.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                  <p className="text-gray-600">{c.description}</p>
                  <button className="mt-4 text-primary font-medium hover:underline">
                    Ver caso completo
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
      <LeadsterChat 
        title="Fale com um especialista"
        message="Olá! Gostaria de saber mais sobre como a BoneHeal pode ajudar nos seus procedimentos de regeneração óssea?"
      />
    </div>
  );
};

export default CasosClinicos;
