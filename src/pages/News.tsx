
import React, { useState, useEffect } from "react";
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
        let query = supabase
          .from("news")
          .select("*")
          .order("published_at", { ascending: false });
          
        if (selectedCategory) {
          query = query.eq("category", selectedCategory);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        return data;
      } catch (err) {
        console.error("Error fetching news:", err);
        return [];
      }
    },
  });

  // Preload news with hardcoded content if not available in database
  useEffect(() => {
    const checkAndPreloadNews = async () => {
      const { data, error } = await supabase
        .from("news")
        .select("count")
        .single();
        
      if (error || (data && data.count < 3)) {
        console.log("Preloading news content...");
        await preloadNewsContent();
      }
    };
    
    checkAndPreloadNews();
  }, []);
  
  const preloadNewsContent = async () => {
    const newsItems = [
      {
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
      },
      {
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
      },
      {
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
      },
      {
        title: "BoneHeal lança nova linha de membranas reabsorvíveis para regeneração tecidual",
        slug: "boneheal-lanca-membranas-reabsorviveis-regeneracao-tecidual",
        summary: "Produtos inovadores combinam excelente manuseio clínico com tempo de reabsorção controlado, ideal para procedimentos de regeneração óssea guiada.",
        content: `<p>A BoneHeal anunciou o lançamento de sua nova linha de membranas reabsorvíveis para procedimentos de regeneração tecidual guiada (RTG) e regeneração óssea guiada (ROG). Os novos produtos, denominados BoneHeal Membrane e BoneHeal Membrane Plus, representam um importante avanço na tecnologia de barreiras biológicas utilizadas em procedimentos regenerativos.</p>
        <p>"Nossas novas membranas foram desenvolvidas após anos de pesquisa para atender às necessidades específicas dos cirurgiões-dentistas que trabalham com regeneração óssea", explicou Marcos Oliveira, CEO da BoneHeal. "Elas combinam excelente manuseio clínico com tempo de reabsorção controlado, permitindo a formação óssea adequada antes da degradação da barreira".</p>
        <p>A BoneHeal Membrane é indicada para procedimentos padrão de RTG e ROG, com tempo de reabsorção de 3-4 meses, enquanto a BoneHeal Membrane Plus oferece maior resistência à degradação, com reabsorção entre 5-6 meses, sendo ideal para casos mais complexos que necessitam de maior tempo de estabilização da área enxertada.</p>
        <p>As membranas são fabricadas a partir de colágeno tipo I altamente purificado, com processo exclusivo que preserva sua estrutura natural enquanto elimina completamente o potencial de resposta imunogênica. Estudos preliminares demonstram excelente biocompatibilidade e integração tecidual.</p>
        <p>Os novos produtos já estão disponíveis para os profissionais brasileiros e serão gradualmente introduzidos nos mercados internacionais onde a BoneHeal atua. A empresa oferecerá treinamentos e suporte técnico para os profissionais interessados em conhecer melhor as características e aplicações clínicas das novas membranas.</p>`,
        featured_image: "https://im.runware.ai/image/ws/0.5/ii/5b483f71-7118-4978-9ba3-e536c6bbce80.webp",
        category: "Inovação",
        tags: "membranas, regeneração tecidual, ROG, RTG, lançamento, biomateriais",
        published_at: "2021-11-10T10:00:00.000Z",
      },
      {
        title: "BoneHeal participa de workshop internacional sobre técnicas avançadas em enxertia óssea",
        slug: "boneheal-workshop-internacional-tecnicas-enxertia-ossea",
        summary: "Evento reuniu especialistas de diversos países para discutir os avanços mais recentes em procedimentos regenerativos para implantodontia.",
        content: `<p>A BoneHeal participou do Workshop Internacional de Técnicas Avançadas em Enxertia Óssea, realizado em Lisboa, Portugal, entre os dias 5 e 7 de maio de 2023. O evento, que reuniu especialistas de diversos países, teve como objetivo discutir os avanços mais recentes em procedimentos regenerativos para implantodontia.</p>
        <p>Durante o workshop, o Dr. Ricardo Almeida, consultor científico da BoneHeal, ministrou uma palestra sobre "Estratégias Contemporâneas para Regeneração Óssea em Casos Complexos", apresentando casos clínicos tratados com as soluções da empresa e discutindo protocolos inovadores.</p>
        <p>"Tivemos a oportunidade de compartilhar nossa experiência com profissionais de diferentes partes do mundo e também aprender com suas abordagens e desafios específicos", comentou o Dr. Almeida. "O intercâmbio de conhecimento em eventos como este é fundamental para o avanço da nossa especialidade".</p>
        <p>Além da palestra, a BoneHeal realizou uma demonstração hands-on de suas tecnologias, permitindo que os participantes experimentassem o manuseio dos biomateriais e compreendessem suas características únicas. O workshop também incluiu discussões sobre as tendências futuras em regeneração óssea e o papel dos fatores de crescimento e tecnologias digitais neste campo.</p>
        <p>A participação da BoneHeal neste evento de prestígio internacional reforça seu compromisso com a educação continuada e o intercâmbio científico, contribuindo para a difusão das mais avançadas técnicas em regeneração óssea guiada.</p>`,
        featured_image: "https://im.runware.ai/image/ws/0.5/ii/8c35d7a9-e221-4a0e-bddd-f7a7b05b8bf6.webp",
        category: "Workshops",
        tags: "workshop internacional, enxertia óssea, técnicas avançadas, implantodontia, regeneração",
        published_at: "2023-05-10T09:30:00.000Z",
      },
      {
        title: "Estudo multicêntrico comprova eficácia da tecnologia BoneHeal em casos de atrofia severa",
        slug: "estudo-multicentrico-eficacia-boneheal-atrofia-severa",
        summary: "Pesquisa realizada em cinco centros clínicos demonstra resultados superiores em regeneração óssea em casos desafiadores de maxila atrófica.",
        content: `<p>Um estudo multicêntrico recentemente concluído demonstrou a eficácia superior da tecnologia BoneHeal em casos de regeneração óssea em pacientes com atrofia severa de maxila. A pesquisa, realizada em cinco centros clínicos em diferentes regiões do Brasil, acompanhou 78 pacientes ao longo de 18 meses.</p>
        <p>Os resultados, publicados no Journal of Advanced Bone Regeneration, demonstraram que pacientes tratados com o protocolo BoneHeal apresentaram ganho ósseo médio de 6,3mm em altura e 4,8mm em espessura, com taxa de sucesso de 94% nos implantes posteriormente instalados nas áreas regeneradas.</p>
        <p>"Este estudo representa um importante avanço na validação científica da nossa tecnologia", afirmou a Dra. Carolina Ribeiro, diretora médica da BoneHeal. "Os casos de atrofia severa representam um dos maiores desafios na implantodontia atual, e nossos resultados demonstram que é possível obter regeneração previsível mesmo nestas situações extremas".</p>
        <p>O estudo utilizou análises tomográficas comparativas pré e pós-operatórias, além de avaliações histológicas de amostras obtidas no momento da instalação dos implantes. As análises demonstraram formação de osso vital de alta qualidade, com excelente vascularização e densidade adequada para suportar cargas protéticas.</p>
        <p>A pesquisa também analisou a satisfação dos pacientes e a qualidade de vida relacionada à saúde bucal, demonstrando melhorias significativas após a reabilitação completa com implantes nas áreas previamente atróficas. Os resultados completos do estudo estarão disponíveis na edição de outubro do Journal of Advanced Bone Regeneration.</p>`,
        featured_image: "https://im.runware.ai/image/ws/0.5/ii/9e246f18-5e74-4c93-bd57-14ba51baa21b.webp",
        category: "Pesquisa",
        tags: "estudo clínico, multicêntrico, atrofia maxilar, regeneração óssea, pesquisa científica",
        published_at: "2022-08-15T14:20:00.000Z",
      },
      {
        title: "BoneHeal ministra curso avançado de regeneração óssea no Congresso Brasileiro de Implantodontia",
        slug: "boneheal-curso-avancado-regeneracao-ossea-congresso-implantodontia",
        summary: "Profissionais de todo o Brasil participaram do treinamento hands-on sobre técnicas inovadoras para aumento ósseo em implantodontia.",
        content: `<p>Durante o XXV Congresso Brasileiro de Implantodontia, realizado entre 8 e 11 de junho de 2023 em Goiânia, a BoneHeal ministrou um curso avançado sobre técnicas inovadoras de regeneração óssea para casos complexos em implantodontia. O curso, que teve duração de 8 horas e incluiu atividades teóricas e práticas, contou com a participação de 45 profissionais de diferentes regiões do país.</p>
        <p>O treinamento foi conduzido pela equipe científica da BoneHeal, liderada pelo Dr. Fernando Moraes, especialista em cirurgia bucomaxilofacial e consultor da empresa. Os participantes tiveram a oportunidade de aprender sobre os princípios biológicos da regeneração óssea e as mais recentes evidências científicas sobre o tema.</p>
        <p>Na parte prática do curso, os profissionais realizaram procedimentos simulados de regeneração óssea vertical e horizontal, utilizando os biomateriais da BoneHeal em modelos anatômicos realistas. "Nosso objetivo é capacitar os profissionais a enfrentarem com confiança os casos mais desafiadores, utilizando técnicas previsíveis e materiais de alta qualidade", explicou o Dr. Moraes.</p>
        <p>Os participantes também receberam material didático completo, incluindo acesso a vídeos de casos clínicos e protocolos detalhados para diferentes situações clínicas. "A formação continuada é fundamental para que os profissionais possam oferecer o melhor tratamento possível aos seus pacientes, especialmente em áreas tão técnicas como a regeneração óssea", destacou Amanda Santana, gerente de educação da BoneHeal.</p>
        <p>O XXV Congresso Brasileiro de Implantodontia é um dos maiores eventos da especialidade no país, reunindo anualmente milhares de profissionais para atualização científica e contato com as mais recentes tecnologias do setor.</p>`,
        featured_image: "https://im.runware.ai/image/ws/0.5/ii/2f4e7b35-a183-4972-84e6-97fef078de11.webp",
        category: "Palestras",
        tags: "curso, implantodontia, regeneração óssea, hands-on, congresso, capacitação",
        published_at: "2023-06-12T11:00:00.000Z",
      },
      {
        title: "BoneHeal firma parceria com faculdades de odontologia para pesquisa em biomateriais",
        slug: "boneheal-parceria-faculdades-odontologia-pesquisa-biomateriais",
        summary: "Acordo de cooperação científica com três instituições de ensino visa desenvolver novos estudos sobre regeneração óssea e formar novos pesquisadores na área.",
        content: `<p>A BoneHeal anunciou a assinatura de um acordo de cooperação científica com três importantes faculdades de odontologia brasileiras para o desenvolvimento de pesquisas no campo de biomateriais para regeneração óssea. A parceria envolve a Universidade de São Paulo (USP), a Universidade Estadual de Campinas (UNICAMP) e a Universidade Federal do Rio de Janeiro (UFRJ).</p>
        <p>O acordo prevê o desenvolvimento conjunto de pesquisas sobre novos biomateriais e técnicas de regeneração, além da formação de novos pesquisadores especializados nesta área. "Esta parceria é estratégica para avançarmos na fronteira do conhecimento em regeneração óssea, unindo a experiência acadêmica destas instituições renomadas com nossa expertise no desenvolvimento de biomateriais", afirmou Beatriz Campos, diretora de inovação da BoneHeal.</p>
        <p>As pesquisas, que terão início imediato, incluem estudos sobre a interação entre biomateriais e fatores de crescimento, novas formulações de substitutos ósseos e o desenvolvimento de estruturas tridimensionais personalizadas para regeneração. A BoneHeal fornecerá suporte financeiro, materiais e equipamentos para os laboratórios envolvidos, além de bolsas para estudantes de mestrado e doutorado.</p>
        <p>"Esta é uma oportunidade única para nossos alunos e pesquisadores trabalharem em projetos com aplicação prática direta, contribuindo para o avanço da odontologia brasileira", destacou o Prof. Dr. Roberto Mendes, coordenador de pós-graduação da Faculdade de Odontologia da USP e um dos responsáveis pela parceria.</p>
        <p>Além das pesquisas, o acordo também prevê a realização de eventos científicos conjuntos, intercâmbio de pesquisadores e a publicação de artigos em revistas internacionais, contribuindo para a maior visibilidade da ciência brasileira no campo da regeneração tecidual.</p>`,
        featured_image: "https://im.runware.ai/image/ws/0.5/ii/6d8b7c12-1935-4a69-b0f8-a27d0bc9f4ae.webp",
        category: "Acadêmico",
        tags: "parceria acadêmica, universidades, pesquisa, biomateriais, inovação",
        published_at: "2022-02-25T10:45:00.000Z",
      },
      {
        title: "BoneHeal recebe certificação internacional ISO 13485 para fabricação de dispositivos médicos",
        slug: "boneheal-certificacao-iso-13485-dispositivos-medicos",
        summary: "Reconhecimento valida o sistema de gestão de qualidade da empresa e abre portas para expansão no mercado internacional de biomateriais.",
        content: `<p>A BoneHeal anunciou a obtenção da certificação ISO 13485:2016, norma internacional que estabelece requisitos para um sistema de gestão da qualidade específico para a indústria de dispositivos médicos. A certificação foi concedida após rigoroso processo de auditoria conduzido pela TÜV Rheinland, organismo certificador de renome mundial.</p>
        <p>"Esta certificação representa um marco importante para nossa empresa, validando todos os esforços que realizamos para garantir a excelência em nossos processos de desenvolvimento, fabricação e controle de qualidade", afirmou Roberto Alves, diretor de qualidade da BoneHeal. "Mais do que um certificado, a ISO 13485 é um compromisso com a melhoria contínua e a segurança de nossos produtos".</p>
        <p>O processo de certificação, que durou aproximadamente oito meses, envolveu a revisão completa de todos os protocolos de fabricação, sistemas de rastreabilidade, gestão de riscos e procedimentos de controle de qualidade da empresa. Foram realizados investimentos significativos em infraestrutura laboratorial, treinamento de equipe e implementação de novos sistemas de gestão digital.</p>
        <p>A certificação ISO 13485 é reconhecida internacionalmente e constitui um pré-requisito para a comercialização de dispositivos médicos em diversos mercados, especialmente na Europa e na Ásia. "Este certificado nos abre portas para a expansão internacional da BoneHeal, permitindo que levemos nossas soluções inovadoras para profissionais e pacientes em outros países", destacou Clara Rodrigues, diretora de negócios internacionais da empresa.</p>
        <p>Além do reconhecimento internacional, a certificação também oferece maior segurança aos parceiros e clientes da BoneHeal no Brasil, confirmando o compromisso da empresa com os mais elevados padrões de qualidade em todas as etapas de desenvolvimento e fabricação de seus biomateriais.</p>`,
        featured_image: "https://im.runware.ai/image/ws/0.5/ii/4d3e79f2-b912-4e67-a73a-b22db843f3b5.webp",
        category: "Tecnologia",
        tags: "certificação, ISO 13485, qualidade, dispositivos médicos, regulatório",
        published_at: "2021-10-20T08:00:00.000Z",
      },
      {
        title: "BoneHeal apresenta linha completa de soluções em regeneração óssea na Dental Expo Brasil",
        slug: "boneheal-solucoes-regeneracao-ossea-dental-expo-brasil",
        summary: "Empresa destacou inovações em biomateriais durante um dos principais eventos odontológicos do ano, atraindo interesse de profissionais de todo o país.",
        content: `<p>A BoneHeal apresentou sua linha completa de soluções para regeneração óssea durante a Dental Expo Brasil 2023, realizada entre os dias 10 e 13 de agosto no São Paulo Expo. O evento, que é considerado um dos maiores encontros do setor odontológico no país, reuniu milhares de profissionais e empresas do segmento.</p>
        <p>No estande da BoneHeal, os visitantes puderam conhecer em detalhes o portfólio completo de biomateriais da empresa, incluindo substitutos ósseos, membranas de colágeno, fatores de crescimento e instrumentais especializados. "Trouxemos para a feira nossa linha completa de produtos, com soluções para cada tipo de deficiência óssea que o profissional pode encontrar na prática clínica", explicou Rodrigo Campos, gerente comercial da BoneHeal.</p>
        <p>Durante os quatro dias de evento, a empresa realizou demonstrações práticas, apresentações de casos clínicos e sessões de consultoria individualizada para os profissionais interessados. "Nossa equipe de especialistas esteve disponível para esclarecer dúvidas técnicas e ajudar os cirurgiões-dentistas a escolherem a melhor solução para seus casos específicos", complementou Campos.</p>
        <p>Uma das novidades apresentadas na feira foi o sistema BoneHeal Custom, que permite a fabricação de estruturas personalizadas para regeneração óssea a partir de exames tomográficos do paciente. A tecnologia, que utiliza impressão 3D, gerou grande interesse entre os implantodontistas presentes.</p>
        <p>"A participação em eventos como a Dental Expo é fundamental para mantermos contato direto com os profissionais que utilizam nossos produtos, compreendendo suas necessidades reais e coletando feedbacks valiosos para nosso processo de inovação contínua", destacou Sofia Rangel, diretora de marketing da BoneHeal.</p>`,
        featured_image: "https://im.runware.ai/image/ws/0.5/ii/1a9c832e-e743-49cb-a28a-d1f5c3e88ed9.webp",
        category: "Eventos",
        tags: "feira odontológica, Dental Expo, biomateriais, regeneração óssea, exposição",
        published_at: "2023-08-15T13:30:00.000Z",
      },
      {
        title: "BoneHeal realiza simpósio sobre o futuro da regeneração óssea na odontologia",
        slug: "boneheal-simposio-futuro-regeneracao-ossea-odontologia",
        summary: "Evento reuniu especialistas nacionais e internacionais para discutir tendências e avanços tecnológicos em regeneração tecidual para implantodontia.",
        content: `<p>A BoneHeal realizou, nos dias 22 e 23 de abril de 2023, o I Simpósio Internacional sobre o Futuro da Regeneração Óssea na Odontologia. O evento, que aconteceu em formato híbrido (presencial e online), reuniu especialistas nacionais e internacionais para discutir as mais recentes tendências e avanços tecnológicos na área de regeneração tecidual para implantodontia.</p>
        <p>O simpósio contou com a participação de palestrantes renomados, como o Dr. David Wilson (EUA), Dr. Massimo Simion (Itália) e Dr. Antonio Sanz (Espanha), além de importantes pesquisadores brasileiros. "Nosso objetivo foi criar um espaço de alto nível científico para a troca de conhecimentos e discussão sobre o futuro da nossa especialidade", afirmou o Dr. Henrique Duarte, diretor científico da BoneHeal e presidente do simpósio.</p>
        <p>Durante os dois dias do evento, foram abordados temas como Regeneração Óssea Guiada Digital, Fatores de Crescimento e Novas Tecnologias em Biomateriais, Engenharia de Tecidos Aplicada à Implantodontia e Desafios Clínicos em Casos de Atrofia Severa. As palestras foram complementadas por mesas-redondas e sessões de casos clínicos.</p>
        <p>Um dos destaques do simpósio foi a sessão de apresentação de pesquisas originais, que contou com a participação de jovens pesquisadores de programas de pós-graduação de todo o Brasil. Os três melhores trabalhos foram premiados com bolsas para participação em cursos internacionais.</p>
        <p>"Estamos extremamente satisfeitos com o nível das discussões e com a participação dos profissionais, tanto presencialmente quanto online. Este é o primeiro de uma série de eventos científicos que pretendemos realizar para fomentar o desenvolvimento da regeneração óssea no Brasil", destacou Luciana Campos, diretora de educação da BoneHeal.</p>`,
        featured_image: "https://im.runware.ai/image/ws/0.5/ii/7b2d6e98-3e64-4f91-a79c-c9d74d518d5a.webp",
        category: "Palestras",
        tags: "simpósio, regeneração óssea, especialistas internacionais, futuro, tendências",
        published_at: "2023-04-25T14:00:00.000Z",
      },
      {
        title: "Pesquisadores da BoneHeal desenvolvem novo protocolo para regeneração óssea em casos de periimplantite",
        slug: "pesquisadores-boneheal-protocolo-regeneracao-ossea-periimplantite",
        summary: "Estudo clínico demonstra eficácia de nova abordagem combinando descontaminação avançada e biomateriais específicos para recuperação de tecido ósseo perdido.",
        content: `<p>Um grupo de pesquisadores da BoneHeal, em colaboração com especialistas da Universidade Estadual Paulista (UNESP), desenvolveu um novo protocolo para regeneração óssea em casos de periimplantite moderada a severa. Os resultados preliminares do estudo clínico foram apresentados durante o Encontro Brasileiro de Periodontia e Implantodontia, realizado em Belo Horizonte entre os dias 3 e 5 de março de 2022.</p>
        <p>A periimplantite, inflamação que afeta os tecidos ao redor de implantes dentários e pode levar à perda óssea progressiva, representa um dos principais desafios na implantodontia moderna. O novo protocolo desenvolvido combina técnicas avançadas de descontaminação da superfície do implante com aplicação sequencial de fatores de crescimento e biomateriais específicos para recuperação do tecido ósseo perdido.</p>
        <p>"Os resultados que obtivemos são bastante promissores, com ganho ósseo médio de 3,7mm em casos onde tradicionalmente o prognóstico seria desfavorável", explicou o Dr. Renato Oliveira, pesquisador principal do estudo. "Mais importante ainda, conseguimos uma taxa de sucesso de 85% na manutenção dos implantes tratados, evitando sua remoção mesmo em casos considerados avançados".</p>
        <p>O protocolo inclui um sistema de descontaminação mecânico-química desenvolvido especificamente para este fim, seguido pela aplicação de concentrado plaquetário autólogo e uma combinação de biomateriais com diferentes taxas de reabsorção, protegidos por uma membrana de colágeno de longa duração.</p>
        <p>A BoneHeal iniciará em breve um estudo multicêntrico mais amplo para validar o protocolo em diferentes populações e condições clínicas. "Estamos muito entusiasmados com estes resultados iniciais e acreditamos que este protocolo pode representar uma solução efetiva para um dos problemas mais desafiadores na implantodontia atual", comentou Marina Soares, coordenadora de pesquisa clínica da empresa.</p>`,
        featured_image: "https://im.runware.ai/image/ws/0.5/ii/2e481f3d-0e2c-44b5-816e-1f8a61e3ce57.webp",
        category: "Pesquisa",
        tags: "periimplantite, regeneração óssea, protocolo clínico, implantodontia, biomateriais",
        published_at: "2022-03-08T08:45:00.000Z",
      }
    ];
    
    // Insert the news items into the database
    for (const item of newsItems) {
      const { error } = await supabase
        .from("news")
        .upsert(item, { onConflict: 'slug' });
        
      if (error) {
        console.error("Error inserting news item:", error);
      }
    }
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
