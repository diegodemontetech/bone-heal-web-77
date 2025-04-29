
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AutoChat from "@/components/AutoChat";
import { Download, FileText, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const StudiesPage = () => {
  // Sample studies data
  const clinicalCases = [
    {
      id: 1,
      title: "Regeneração óssea após exodontia de molar",
      description: "Caso clínico demonstrando regeneração óssea completa após exodontia de molar inferior com utilização da membrana Heal Bone.",
      image: "/case-study-1.jpg",
      author: "Dr. João Silva",
      date: "Maio 2023"
    },
    {
      id: 2,
      title: "Correção de fenestração em implante imediato",
      description: "Resolução de fenestração óssea em região anterior com aplicação da técnica Bone Heal em conjunto com implante imediato.",
      image: "/case-study-2.jpg",
      author: "Dra. Maria Santos",
      date: "Janeiro 2023"
    },
    {
      id: 3,
      title: "Preservação alveolar em região estética",
      description: "Preservação do rebordo alveolar após extração de incisivo central superior com utilização da membrana Heal Bone.",
      image: "/case-study-3.jpg",
      author: "Dr. Roberto Almeida",
      date: "Outubro 2022"
    }
  ];

  const scientificPublications = [
    {
      id: 1,
      title: "Avaliação clínica e histológica da regeneração óssea guiada utilizando membranas não-reabsorvíveis",
      journal: "Journal of Osseointegration",
      year: 2022,
      authors: "Salomão M., Ferreira J., Santos A., et al.",
      link: "#"
    },
    {
      id: 2,
      title: "Estudo comparativo entre diferentes técnicas de regeneração óssea em defeitos alveolares pós-extração",
      journal: "Implant Dentistry",
      year: 2021,
      authors: "Silva R., Oliveira P., Salomão M., et al.",
      link: "#"
    },
    {
      id: 3,
      title: "Análise tomográfica da preservação do rebordo alveolar utilizando a técnica Bone Heal",
      journal: "International Journal of Oral & Maxillofacial Implants",
      year: 2020,
      authors: "Santos L., Ferreira C., Salomão M., et al.",
      link: "#"
    },
    {
      id: 4,
      title: "Regeneração óssea guiada em alvéolos pós-extração: uma revisão sistemática",
      journal: "Journal of Clinical Periodontology",
      year: 2019,
      authors: "Martins T., Salomão M., Costa R., et al.",
      link: "#"
    }
  ];

  const presentations = [
    {
      id: 1,
      title: "Técnicas avançadas de regeneração óssea com membranas não-reabsorvíveis",
      event: "Congresso Internacional de Implantodontia",
      location: "São Paulo, Brasil",
      date: "Maio 2023",
      presenter: "Prof. Dr. Munir Salomão"
    },
    {
      id: 2,
      title: "Protocolos clínicos para preservação alveolar com a técnica Bone Heal",
      event: "Simpósio de Regeneração Tecidual",
      location: "Lisboa, Portugal",
      date: "Novembro 2022",
      presenter: "Dr. Carlos Ferreira"
    },
    {
      id: 3,
      title: "Resultados de longo prazo da regeneração óssea guiada em casos complexos",
      event: "Encontro Latino-Americano de Periodontia",
      location: "Buenos Aires, Argentina",
      date: "Agosto 2022",
      presenter: "Dra. Ana Santos"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/5 to-primary/20 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">Estudos Clínicos</h1>
            <p className="text-lg max-w-3xl mx-auto text-gray-700">
              Conheça nossa base científica e evidências clínicas que comprovam a eficácia da tecnologia Bone Heal
            </p>
          </div>
        </section>

        {/* Studies Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="cases" className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                <TabsTrigger value="cases">Casos Clínicos</TabsTrigger>
                <TabsTrigger value="publications">Publicações Científicas</TabsTrigger>
                <TabsTrigger value="presentations">Apresentações</TabsTrigger>
              </TabsList>
              
              {/* Clinical Cases */}
              <TabsContent value="cases" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {clinicalCases.map((caseStudy) => (
                    <div key={caseStudy.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={caseStudy.image || "/case-placeholder.jpg"} 
                          alt={caseStudy.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg mb-2">{caseStudy.title}</h3>
                        <p className="text-gray-600 mb-4">{caseStudy.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>{caseStudy.author}</span>
                          <span>{caseStudy.date}</span>
                        </div>
                        <Button variant="outline" className="w-full">
                          Ver Caso Completo <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {/* Scientific Publications */}
              <TabsContent value="publications" className="mt-8">
                <div className="space-y-6">
                  {scientificPublications.map((publication) => (
                    <div key={publication.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-lg mb-2">{publication.title}</h3>
                          <p className="text-gray-600 mb-1">
                            <span className="font-medium">Autores:</span> {publication.authors}
                          </p>
                          <p className="text-gray-600 mb-1">
                            <span className="font-medium">Publicação:</span> {publication.journal}, {publication.year}
                          </p>
                        </div>
                        <div className="flex flex-shrink-0">
                          <Button variant="outline" className="mr-2">
                            <FileText className="mr-2 h-4 w-4" /> Resumo
                          </Button>
                          <Button>
                            <Download className="mr-2 h-4 w-4" /> PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {/* Presentations */}
              <TabsContent value="presentations" className="mt-8">
                <div className="space-y-6">
                  {presentations.map((presentation) => (
                    <div key={presentation.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                      <h3 className="font-bold text-lg mb-2">{presentation.title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Evento</p>
                          <p className="font-medium">{presentation.event}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Local</p>
                          <p className="font-medium">{presentation.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Data</p>
                          <p className="font-medium">{presentation.date}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">
                        <span className="font-medium">Apresentador:</span> {presentation.presenter}
                      </p>
                      <Button variant="outline">
                        <ExternalLink className="mr-2 h-4 w-4" /> Ver Apresentação
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Quer saber mais sobre nossos produtos?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Conheça nossa linha completa de produtos para regeneração óssea e tecidual
            </p>
            <Link to="/produtos">
              <Button className="bg-white text-primary hover:bg-gray-100">
                Ver Produtos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <AutoChat />
    </div>
  );
};

export default StudiesPage;
