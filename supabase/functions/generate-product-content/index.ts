
// Importações necessárias
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Dados técnicos pré-definidos para categorias de produtos
const technicalDetailsTemplates = {
  // Template para membranas regenerativas
  membrane: {
    dimensions: {
      weight: "0.5g a 2g",
      height: "0.3mm a 0.5mm",
      width: "variável de acordo com tamanho",
      length: "variável de acordo com tamanho"
    },
    materials: {
      material: "Polipropileno/PTFE/Colágeno",
      composition: "Polímero biocompatível de alta pureza"
    },
    usage: {
      indication: "Regeneração tecidual guiada, barreira para enxertos ósseos",
      contraindication: "Pacientes com alergia aos componentes, infecções ativas",
      instructions: "Hidratar antes do uso, posicionar sobre o defeito ósseo"
    },
    regulatory: {
      registration: "ANVISA 80XXXXXX",
      classification: "Classe III - Médio/Alto Risco"
    }
  },
  // Template para biomateriais de enxerto
  graft: {
    dimensions: {
      weight: "0.25g a 2.0g",
      height: "Granulado/Bloco",
      width: "Variável",
      length: "Variável"
    },
    materials: {
      material: "Osso bovino/Sintético/Xenoenxerto",
      composition: "Hidroxiapatita e colágeno"
    },
    usage: {
      indication: "Preenchimento de defeitos ósseos, levantamento de seio maxilar",
      contraindication: "Pacientes com processos infecciosos ativos",
      instructions: "Hidratar com sangue do paciente ou soro antes da aplicação"
    },
    regulatory: {
      registration: "ANVISA 80XXXXXX",
      classification: "Classe III - Médio/Alto Risco"
    }
  },
  // Template padrão para outros produtos
  default: {
    dimensions: {
      weight: "Consultar embalagem",
      height: "Consultar embalagem",
      width: "Consultar embalagem",
      length: "Consultar embalagem"
    },
    materials: {
      material: "Verificar embalagem do produto",
      composition: "Verificar embalagem do produto"
    },
    usage: {
      indication: "Conforme orientação profissional",
      contraindication: "Verificar bula do produto",
      instructions: "Seguir orientação do fabricante"
    },
    regulatory: {
      registration: "ANVISA: Verificar embalagem",
      classification: "Verificar embalagem"
    }
  }
};

// Função para classificar o produto com base no nome
function classifyProduct(productName) {
  const lowerName = productName?.toLowerCase() || '';
  
  if (lowerName.includes('membrana') || lowerName.includes('bone heal') || lowerName.includes('heal bone')) {
    return 'membrane';
  } else if (lowerName.includes('enxerto') || lowerName.includes('graft') || lowerName.includes('xenoenxerto')) {
    return 'graft';
  }
  
  return 'default';
}

// Função para gerar uma descrição curta
function generateShortDescription(productName, omieCode) {
  const nameParts = productName?.split(' ') || [];
  let dimensions = '';
  
  // Tentar extrair dimensões do nome (padrões como 15x20mm, 30x40mm, etc)
  const dimensionsMatch = productName?.match(/\d+\s*[xX]\s*\d+\s*mm/) || productName?.match(/\d+\s*[xX]\s*\d+/);
  if (dimensionsMatch) {
    dimensions = dimensionsMatch[0];
  }
  
  // Extrair marca (geralmente após parênteses)
  let brand = '';
  const brandMatch = productName?.match(/\(([^)]+)\)/) || [];
  if (brandMatch.length > 1) {
    brand = brandMatch[1];
  } else if (nameParts.length > 2) {
    // Se não encontrou entre parênteses, use o último termo como possível marca
    brand = nameParts[nameParts.length - 1];
  }
  
  // Categoria do produto (primeira parte do nome geralmente)
  let category = '';
  if (nameParts.length > 0) {
    category = nameParts.slice(0, 2).join(' ');
  }
  
  // Montar descrição curta
  let shortDescription = '';
  
  if (dimensions) {
    shortDescription += `${dimensions} | `;
  }
  
  if (brand) {
    shortDescription += `${brand} | `;
  }
  
  if (category) {
    shortDescription += category;
  } else if (productName) {
    // Usar parte do nome se a categoria não foi identificada
    shortDescription += productName.split(' ').slice(0, 3).join(' ');
  } else {
    shortDescription += `Produto ${omieCode}`;
  }
  
  return shortDescription;
}

// Função para gerar uma descrição longa
function generateLongDescription(productName, omieCode) {
  if (!productName) return `Produto código ${omieCode}. Entre em contato para mais informações.`;
  
  const productType = classifyProduct(productName);
  let description = '';
  
  if (productType === 'membrane') {
    description = `${productName} é uma membrana regenerativa utilizada em procedimentos odontológicos para regeneração tecidual guiada. 
    
    Ideal para ser utilizada como barreira em procedimentos de enxertia óssea, prevenindo a migração de células epiteliais e permitindo a regeneração óssea adequada.
    
    Características:
    - Biocompatível
    - Resistente
    - Fácil manuseio
    - Adaptável a diferentes morfologias de defeitos ósseos
    
    Este produto é indicado para procedimentos de regeneração óssea guiada, preservação alveolar, levantamento de seio maxilar, e tratamento de defeitos intra-ósseos.`;
  } else if (productType === 'graft') {
    description = `${productName} é um biomaterial para enxertia óssea desenvolvido para procedimentos de regeneração óssea em odontologia.
    
    Composto por material altamente biocompatível, oferece excelente osteointegração e baixa taxa de reabsorção, garantindo estabilidade ao enxerto.
    
    Características:
    - Alta porosidade
    - Excelente osteoindução
    - Manipulação facilitada
    - Ótima integração ao tecido ósseo natural
    
    Indicado para preenchimento de defeitos ósseos, levantamento de seio maxilar, preservação alveolar e procedimentos de aumento ósseo em geral.`;
  } else {
    description = `${productName} é um produto desenvolvido com os mais altos padrões de qualidade para uso em procedimentos odontológicos.
    
    Código do produto: ${omieCode}
    
    Para informações detalhadas sobre indicações, modo de uso e precauções, consulte a bula do produto ou entre em contato com nossa equipe técnica.`;
  }
  
  return description;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { omieCode, productName, contentType } = await req.json();
    
    if (!omieCode) {
      throw new Error("Código Omie não informado");
    }
    
    console.log(`Gerando ${contentType || 'conteúdo'} para produto: ${omieCode} - ${productName || 'sem nome'}`);
    
    // Preparar resposta baseada no tipo de conteúdo solicitado
    let responseData;
    
    if (contentType === 'technical_details') {
      // Classificar o produto e obter template apropriado
      const productType = classifyProduct(productName);
      const template = technicalDetailsTemplates[productType];
      
      // Personalizar alguns campos do template com base no nome do produto
      const customizedTemplate = JSON.parse(JSON.stringify(template));
      
      // Tentar extrair dimensões se presentes no nome
      const dimensionsMatch = productName?.match(/(\d+)\s*[xX]\s*(\d+)\s*(?:mm)?/);
      if (dimensionsMatch && dimensionsMatch.length >= 3) {
        const width = dimensionsMatch[1];
        const length = dimensionsMatch[2];
        customizedTemplate.dimensions.width = `${width}mm`;
        customizedTemplate.dimensions.length = `${length}mm`;
      }
      
      // Adicionar código ao registro regulatório
      customizedTemplate.regulatory.registration += ` (Código Omie: ${omieCode})`;
      
      responseData = {
        technical_details: customizedTemplate
      };
    } else {
      // Gerar descrições para o produto
      responseData = {
        short_description: generateShortDescription(productName, omieCode),
        description: generateLongDescription(productName, omieCode)
      };
    }
    
    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Erro na função:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro desconhecido ao gerar conteúdo" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
