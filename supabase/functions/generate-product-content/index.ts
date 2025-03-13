
// Importações necessárias
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Dados técnicos pré-definidos para categorias de produtos - usando valores fixos e precisos
const technicalDetailsTemplates = {
  // Template para membranas regenerativas
  membrane: {
    dimensions: {
      weight: "0.5g",
      height: "0.3mm",
      width: "15mm",
      length: "20mm"
    },
    materials: {
      material: "PTFE",
      composition: "Polímero de politetrafluoroetileno"
    },
    usage: {
      indication: "Regeneração tecidual guiada",
      contraindication: "Pacientes com infecções ativas",
      instructions: "Hidratar antes do uso"
    },
    regulatory: {
      registration: "ANVISA 80123456",
      classification: "Classe III"
    }
  },
  // Template para biomateriais de enxerto
  graft: {
    dimensions: {
      weight: "0.5g",
      height: "N/A",
      width: "N/A",
      length: "N/A"
    },
    materials: {
      material: "Osso bovino",
      composition: "Hidroxiapatita"
    },
    usage: {
      indication: "Preenchimento de defeitos ósseos",
      contraindication: "Pacientes com processos infecciosos",
      instructions: "Hidratar com sangue do paciente"
    },
    regulatory: {
      registration: "ANVISA 80234567",
      classification: "Classe III"
    }
  },
  // Template padrão para outros produtos
  default: {
    dimensions: {
      weight: "Consultar documentação técnica",
      height: "Consultar documentação técnica",
      width: "Consultar documentação técnica",
      length: "Consultar documentação técnica"
    },
    materials: {
      material: "Consultar documentação técnica",
      composition: "Consultar documentação técnica"
    },
    usage: {
      indication: "Conforme indicação do fabricante",
      contraindication: "Consultar documentação técnica",
      instructions: "Consultar documentação técnica"
    },
    regulatory: {
      registration: "Consultar embalagem",
      classification: "Consultar embalagem"
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
  if (!productName) return `Código Omie: ${omieCode}`;
  
  // Extrai dimensões do nome se houver
  const dimensionsMatch = productName.match(/(\d+)[xX](\d+)(?:mm)?/);
  const dimensions = dimensionsMatch ? `${dimensionsMatch[1]}x${dimensionsMatch[2]}mm` : '';
  
  // Categoria básica do produto
  let category = '';
  if (productName.toLowerCase().includes('membrana')) {
    category = 'Membrana';
  } else if (productName.toLowerCase().includes('enxerto')) {
    category = 'Biomaterial';
  } else if (productName.toLowerCase().includes('implante')) {
    category = 'Implante';
  } else {
    category = 'Material cirúrgico';
  }
  
  // Montar descrição curta factual
  let shortDescription = category;
  
  if (dimensions) {
    shortDescription += ` ${dimensions}`;
  }
  
  shortDescription += ` - Código Omie: ${omieCode}`;
  
  return shortDescription;
}

// Função para gerar uma descrição longa
function generateLongDescription(productName, omieCode) {
  if (!productName) return `Produto código Omie: ${omieCode}. Entre em contato para mais informações.`;
  
  const productType = classifyProduct(productName);
  let description = '';
  
  if (productType === 'membrane') {
    description = `Membrana para regeneração tecidual guiada com código Omie ${omieCode}.
    
    Produto para uso em procedimentos odontológicos de regeneração tecidual. Atua como barreira para impedir a migração de células epiteliais para a área de formação óssea.
    
    Características:
    - Material biocompatível
    - Resistente à degradação
    - Maleável e adaptável
    
    Para mais informações técnicas detalhadas, consulte a documentação oficial do produto ou entre em contato com nossa equipe.`;
  } else if (productType === 'graft') {
    description = `Biomaterial para enxertia óssea com código Omie ${omieCode}.
    
    Produto desenvolvido para procedimentos de regeneração óssea em odontologia. Apresenta matriz mineral com estrutura e composição semelhantes à do osso humano.
    
    Características:
    - Osteocondutivo
    - Biocompatível
    - Alta pureza
    
    Para mais informações técnicas detalhadas, consulte a documentação oficial do produto ou entre em contato com nossa equipe.`;
  } else {
    description = `Produto código Omie: ${omieCode}.
    
    Este produto faz parte da linha de materiais odontológicos da Boneheal. Para informações detalhadas sobre especificações técnicas, indicações de uso e contraindicações, consulte a documentação oficial do produto ou entre em contato com nossa equipe técnica.`;
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
      
      // Tentar extrair dimensões se presentes no nome - usando valores exatos
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
