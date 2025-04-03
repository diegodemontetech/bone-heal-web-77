
// Importações necessárias
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Dados técnicos pré-definidos para categorias de produtos
const technicalDetailsTemplates = {
  // Template para Bone Heal
  boneHeal: {
    material: "100% polipropileno, impermeável",
    composição: "Filme de polipropileno",
    características: "Não adere aos tecidos, reduz a morbidade, aumenta o conforto pós-operatório",
    compatibilidade: "Compatível com todos os sistemas de implantes, imediatos ou mediatos",
    indicações: "Exodontias unitárias ou múltiplas, dependendo do tamanho",
    técnica: "Simples, sendo removida sem necessidade de anestesia e segunda cirurgia",
    registro_anvisa: "81197590000"
  },
  // Template para Heal Bone
  healBone: {
    material: "100% polipropileno, biocompatível, não-reabsorvível, impermeável",
    composição: "Película de polipropileno sem porosidade",
    características: "Elimina problemas de deiscência, reduz morbidade, aumenta conforto pós-operatório",
    indicações: "Todos os casos pós-exodontias, perda de parede alveolar, implantes imediatos e correção de fenestrações ósseas",
    técnica: "Simples, segura e previsível",
    vantagens: "Elimina a necessidade de outros biomateriais, reduz a necessidade de liberação de grandes retalhos",
    registro_anvisa: "81197590000"
  },
  // Template padrão para outros produtos
  default: {
    material: "Consultar documentação técnica",
    composição: "Consultar documentação técnica",
    indicações: "Consultar documentação técnica",
    registro_anvisa: "81197590000"
  }
};

// Função para classificar o produto com base no nome
function classifyProduct(productName) {
  const lowerName = productName?.toLowerCase() || '';
  
  if (lowerName.includes('bone heal')) {
    return 'boneHeal';
  } else if (lowerName.includes('heal bone')) {
    return 'healBone';
  }
  
  return 'default';
}

// Função para gerar uma descrição curta
function generateShortDescription(productName, omieCode) {
  if (!productName) return `Código Omie: ${omieCode}`;
  
  // Extrai dimensões do nome se houver
  const dimensionsMatch = productName.match(/(\d+)[xX](\d+)(?:mm)?/);
  const dimensions = dimensionsMatch ? `${dimensionsMatch[1]}x${dimensionsMatch[2]}mm` : '';
  
  // Determinar tipo de produto
  let description = '';
  
  if (productName.toLowerCase().includes('bone heal')) {
    description = `Barreira Bone Heal® de polipropileno`;
    if (dimensions) {
      description += ` ${dimensions}`;
      
      if (dimensions.includes('15x40')) {
        description += ` - Indicada para exodontia unitária`;
      } else if (dimensions.includes('20x30')) {
        description += ` - Indicada para até 2 elementos contíguos`;
      } else if (dimensions.includes('30x40')) {
        description += ` - Indicada para até 3 elementos contíguos`;
      }
    }
  } 
  else if (productName.toLowerCase().includes('heal bone')) {
    description = `Barreira Heal Bone® de polipropileno`;
    if (dimensions) {
      description += ` ${dimensions}`;
      
      if (dimensions.includes('15x40')) {
        description += ` - Indicada para exodontia unitária`;
      } else if (dimensions.includes('20x30')) {
        description += ` - Indicada para até 2 elementos contíguos`;
      } else if (dimensions.includes('30x40')) {
        description += ` - Indicada para até 3 elementos contíguos`;
      }
    }
  }
  else {
    description = productName;
  }
  
  // Adicionar código
  description += ` | Código: ${omieCode}`;
  
  return description;
}

// Função para gerar uma descrição longa
function generateLongDescription(productName, omieCode) {
  if (!productName) return `Produto código Omie: ${omieCode}. Entre em contato para mais informações.`;
  
  const productType = classifyProduct(productName);
  
  // Determinar dimensões para personalizar descrição
  const dimensionsMatch = productName.match(/(\d+)[xX](\d+)(?:mm)?/);
  const dimensions = dimensionsMatch ? `${dimensionsMatch[1]}x${dimensionsMatch[2]}mm` : '';
  
  let dimensionText = "";
  if (dimensions.includes('15x40')) {
    dimensionText = "Tamanho do produto: 15mm x 40mm, indicado para defeitos correspondentes a exodontia unitária.";
  } else if (dimensions.includes('20x30')) {
    dimensionText = "Tamanho do produto: 20mm x 30mm, indicado para defeitos correspondentes a exodontia de 2 elementos contíguos.";
  } else if (dimensions.includes('30x40')) {
    dimensionText = "Tamanho do produto: 30mm x 40mm, indicado para defeitos correspondentes a exodontia de 3 a 4 elementos contíguos.";
  }
  
  if (productType === 'boneHeal') {
    return `Bone Heal® - 100% impermeável.
    
Compatível com todos os sistemas de implantes, imediatos ou mediatos.

Dispensa o uso de enxertos e/ou biomateriais. Todavia, fica a critério do Cirurgião o uso desses materiais, alterando o tempo mínimo de remoção para 30 dias.

Dispensa o uso de parafusos, tachinhas ou qualquer artefato de fixação, podendo ser usado com qualquer fio de sutura.

Por ser exposta ao meio bucal, as suturas não exercem pressão sobre a barreira, portanto, elimina os problemas decorrentes das deiscências de suturas.

Técnica cirúrgica simples de ser executada, sendo removida sem necessidade de anestesia e segunda cirurgia.

Não adere aos tecidos.

Reduz a morbidade.

Aumenta o conforto pós-operatório.

${dimensionText}

Registro ANVISA: 81197590000`;
  } 
  else if (productType === 'healBone') {
    return `Heal Bone® é uma película biocompatível, não-reabsorvível, impermeável, constituída 100% por um filme de polipropileno. Projetada para permanecer exposta intencionalmente ao meio bucal, não apresenta porosidade em sua superfície, o que lhe confere total impermeabilidade dificultando o acúmulo de detritos, restos alimentares e micro organismos em sua superfície.

A barreira Heal Bone utiliza apenas o coágulo sanguíneo, sem adição de enxertos ou implante de biomateriais de qualquer natureza, é possível solucionar problemas complexos através de uma técnica cirúrgica simples, segura e previsível, objetivando a regeneração simultânea tanto do tecido ósseo quanto dos tecidos moles.

Mais Vantagens:

– Elimina os problemas decorrentes das deiscências de suturas
– Elimina a necessidade de outros biomateriais
– Reduz a morbidade, aumenta o conforto pós-operatório
– Reduz a necessidade de liberação de grandes retalhos
– Elimina o risco das infecções decorrentes de enxertos
– Promove o aumento do volume de tecido ósseo para inserção do implante
– Regeneração tanto do tecido ósseo quanto do tecido mole.

Indicações:

A barreira não-reabsorvível Heal Bone é indicada em todos os casos pós–exodontias, independentemente da causa, principalmente quando houver perda de parede alveolar, nos casos de implantes imediatos e na correção de fenestrações ósseas.

${dimensionText}

Registro ANVISA: 81197590000`;
  } 
  else {
    return `Produto código Omie: ${omieCode}.
    
Este produto faz parte da linha de materiais odontológicos da Boneheal. Para informações detalhadas sobre especificações técnicas, indicações de uso e contraindicações, consulte a documentação oficial do produto ou entre em contato com nossa equipe técnica.

Registro ANVISA: 81197590000`;
  }
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
      
      // Extrair dimensões se presentes no nome
      const dimensionsMatch = productName?.match(/(\d+)\s*[xX]\s*(\d+)\s*(?:mm)?/);
      if (dimensionsMatch && dimensionsMatch.length >= 3) {
        const width = dimensionsMatch[1];
        const length = dimensionsMatch[2];
        
        // Adicionar dimensões e indicação conforme o tamanho
        let indicação = "";
        if (width === "15" && length === "40") {
          indicação = "Exodontia unitária";
        } else if (width === "20" && length === "30") {
          indicação = "Até 2 elementos contíguos";
        } else if (width === "30" && length === "40") {
          indicação = "Até 3 elementos contíguos";
        }
        
        customizedTemplate.dimensões = `${width}mm x ${length}mm`;
        customizedTemplate.indicação = indicação;
      }
      
      // Adicionar código ao registro regulatório
      customizedTemplate.código_produto = omieCode;
      
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
