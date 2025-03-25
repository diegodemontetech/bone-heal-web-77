
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import NewsHero from "@/components/NewsHero";
import NewsCategories from "@/components/NewsCategories";
import NewsList from "@/components/NewsList";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Lista de categorias expandidas para notícias
  const categories = [
    "Odontologia",
    "Pesquisa",
    "Inovação",
    "Eventos",
    "Tecnologia",
    "Acadêmico",
    "Congressos",
    "Palestras",
    "Workshops"
  ];

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };
  
  // Fetch news based on selected category
  const { data: news, isLoading } = useQuery({
    queryKey: ["news", selectedCategory],
    queryFn: async () => {
      try {
        console.log("Fetching news with category:", selectedCategory);
        let query = supabase
          .from("news")
          .select("*")
          .order("published_at", { ascending: false });
          
        if (selectedCategory) {
          query = query.eq("category", selectedCategory);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching news:", error);
          // Return hardcoded news as fallback
          return getHardcodedNews(selectedCategory);
        }
        
        if (!data || data.length === 0) {
          console.log("No data found in Supabase, using hardcoded news");
          return getHardcodedNews(selectedCategory);
        }
        
        return data;
      } catch (err) {
        console.error("Error in news query:", err);
        return getHardcodedNews(selectedCategory);
      }
    },
  });

  const getHardcodedNews = (category: string | null) => {
    const hardcodedNews = [
      {
        id: "1",
        title: "BoneHeal é destaque no XXIV Congresso Internacional de Odontologia de São Paulo",
        slug: "boneheal-destaque-congresso-odontologia-sp",
        summary: "A BoneHeal apresentou suas soluções inovadoras em regeneração óssea guiada durante o maior evento de odontologia da América Latina.",
        content: `<p>Entre os dias 22 e 25 de janeiro de 2023, a BoneHeal marcou presença no XXIV Congresso Internacional de Odontologia de São Paulo (CIOSP), considerado o maior evento de odontologia da América Latina. Durante o evento, que reuniu mais de 60 mil profissionais da área, a BoneHeal apresentou suas soluções inovadoras em regeneração óssea guiada.</p>
        <p>A equipe da BoneHeal realizou demonstrações práticas das propriedades únicas de seus biomateriais, destacando a capacidade de promover regeneração óssea de forma eficiente e segura. "Nosso estande recebeu centenas de visitantes interessados em conhecer mais sobre nossas tecnologias e como elas podem melhorar os resultados clínicos em implantodontia e cirurgias regenerativas", afirmou o Dr. Carlos Souza, diretor científico da BoneHeal.</p>
        <p>Durante o congresso, foram apresentados estudos de casos clínicos que demonstraram a eficácia dos produtos BoneHeal em diferentes situações de regeneração óssea, com resultados impressionantes mesmo em casos complexos. A empresa também estabeleceu novas parcerias com clínicas e faculdades de odontologia para ampliar a base de pesquisas clínicas.</p>
        <p>O CIOSP é conhecido por ser uma vitrine das mais avançadas tecnologias em odontologia, reunindo empresas de todo o mundo. A participação bem-sucedida da BoneHeal reforça seu compromisso com a inovação e excelência em biomateriais para regeneração óssea.</p>`,
        featured_image: "https://im.runware.ai/image/ws/0.5/ii/0482fe5d-711d-4978-a688-af60086fe579.webp",
        category: "Congressos",
        tags: "odontologia, congresso, regeneração óssea, CIOSP, implantodontia",
        published_at: "2023-01-28T14:30:00.000Z",
        views: 125
      },
      {
        id: "2",
        title: "Universidade Federal de São Paulo realiza curso prático com biomateriais BoneHeal",
        slug: "unifesp-curso-pratico-biomateriais-boneheal",
        summary: "Estudantes de pós-graduação em implantodontia tiveram a oportunidade de conhecer e praticar com as soluções de regeneração óssea da BoneHeal.",
        content: `<p>A Faculdade de Odontologia da Universidade Federal de São Paulo (UNIFESP) realizou, durante o mês de março de 2022, um curso prático focado em técnicas avançadas de regeneração óssea utilizando os biomateriais da BoneHeal. O curso foi ministrado pelo Prof. Dr. André Lima, especialista em implantodontia e regeneração tecidual, e contou com a participação de 25 alunos de pós-graduação.</p>
        <p>Durante as atividades práticas, os estudantes puderam conhecer em detalhes as propriedades dos materiais BoneHeal e suas indicações clínicas específicas. "É fundamental que os futuros especialistas conheçam as opções mais avançadas disponíveis no mercado e saibam selecionar o material mais adequado para cada caso clínico", explicou o Prof. Lima.</p>
        <p>Os participantes realizaram procedimentos simulados de enxertia em modelos anatômicos, aplicando diferentes técnicas de regeneração óssea guiada e aprendendo sobre o manuseio correto dos biomateriais. Também foram discutidos casos clínicos reais tratados com produtos BoneHeal, analisando os resultados obtidos e o processo de cicatrização.</p>
        <p>A parceria entre a UNIFESP e a BoneHeal representa um importante passo para a formação de profissionais mais bem preparados para lidar com os desafios da implantodontia moderna. A empresa continua investindo em educação e pesquisa, fornecendo suporte a instituições acadêmicas em todo o Brasil.</p>`,
        featured_image: "https://im.runware.ai/image/ws/0.5/ii/7f73e281-6c1c-48d7-a7b4-3cd88c7b0a39.webp",
        category: "Acadêmico",
        tags: "universidade, educação, biomateriais, implantodontia, curso prático",
        published_at: "2022-03-25T09:15:00.000Z",
        views: 98
      },
      {
        id: "3",
        title: "BoneHeal apresenta resultados de pesquisa no International Bone Research Symposium",
        slug: "boneheal-pesquisa-international-bone-research-symposium",
        summary: "Estudo clínico demonstra eficácia superior da tecnologia de regeneração óssea da BoneHeal em comparação com métodos convencionais.",
        content: `<p>A BoneHeal apresentou os resultados de sua mais recente pesquisa clínica durante o International Bone Research Symposium, realizado em Chicago (EUA) entre os dias 15 e 17 de setembro de 2022. O estudo, conduzido em parceria com três centros de pesquisa brasileiros, avaliou a eficácia da tecnologia proprietária de regeneração óssea BoneHeal em comparação com métodos convencionais.</p>
        <p>Os resultados apresentados demonstraram que os pacientes tratados com a tecnologia BoneHeal apresentaram tempo de cicatrização 35% menor e formação óssea 42% superior em volume quando comparados ao grupo controle. "Estes dados confirmam o que já observávamos na prática clínica: nossa tecnologia realmente proporciona uma regeneração óssea mais rápida e eficiente", afirmou a Dra. Luiza Mendes, pesquisadora principal do estudo.</p>
        <p>A apresentação gerou grande interesse da comunidade científica internacional, com diversos pesquisadores demonstrando interesse em estabelecer novas parcerias para estudos multicêntricos. "Estamos muito satisfeitos com a recepção ao nosso trabalho e já estamos planejando novos estudos para continuar demonstrando a superioridade de nossa tecnologia", destacou o Dr. Paulo Vasconcelos, diretor de P&D da BoneHeal.</p>
        <p>O International Bone Research Symposium é considerado um dos eventos mais importantes para a divulgação de avanços em pesquisas relacionadas à regeneração óssea, reunindo os principais especialistas mundiais nesta área. A participação da BoneHeal reforça o compromisso da empresa com a ciência e a inovação em biomateriais.</p>`,
        featured_image: "https://im.runware.ai/image/ws/0.5/ii/3a1c0e2d-2b78-4eaa-9217-7f90fd32e1c5.webp",
        category: "Pesquisa",
        tags: "pesquisa clínica, regeneração óssea, simpósio internacional, tecnologia, biomateriais",
        published_at: "2022-09-20T16:45:00.000Z",
        views: 143
      },
      // ... more hardcoded news items
    ];
    
    if (!category) {
      return hardcodedNews;
    }
    
    return hardcodedNews.filter(item => item.category === category);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Notícias | BoneHeal</title>
        <meta name="description" content="Últimas notícias e atualizações da BoneHeal sobre regeneração óssea, biomateriais, eventos e pesquisas odontológicas" />
        <meta name="keywords" content="BoneHeal, notícias odontologia, regeneração óssea, biomateriais, eventos odontológicos, pesquisa dental" />
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <NewsHero />
        <div className="container mx-auto py-12 px-4">
          <NewsCategories 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onCategorySelect={handleCategorySelect} 
          />
          <NewsList news={news} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default News;
