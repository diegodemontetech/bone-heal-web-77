import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ShippingRequest {
  zipCodeOrigin: string;
  zipCodeDestination: string;
  weight: number;
  length: number;
  width: number;
  height: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { zipCodeOrigin, zipCodeDestination, weight, length, width, height } = await req.json() as ShippingRequest;

    // Validar CEPs
    if (!zipCodeOrigin || !zipCodeDestination) {
      throw new Error("CEP de origem e destino são obrigatórios");
    }

    // Remover caracteres não numéricos dos CEPs
    const cleanOriginZip = zipCodeOrigin.replace(/\D/g, '');
    const cleanDestinationZip = zipCodeDestination.replace(/\D/g, '');

    // Construir URL dos Correios (usando PAC e SEDEX)
    const url = `http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?` + 
      `nCdEmpresa=` +
      `&sDsSenha=` +
      `&sCepOrigem=${cleanOriginZip}` +
      `&sCepDestino=${cleanDestinationZip}` +
      `&nVlPeso=${weight}` +
      `&nCdFormato=1` + // 1 = caixa/pacote
      `&nVlComprimento=${length}` +
      `&nVlAltura=${height}` +
      `&nVlLargura=${width}` +
      `&sCdMaoPropria=n` +
      `&nVlValorDeclarado=0` +
      `&sCdAvisoRecebimento=n` +
      `&nCdServico=04510,04014` + // PAC e SEDEX
      `&nVlDiametro=0` +
      `&StrRetorno=xml` +
      `&nIndicaCalculo=3`; // Preço e Prazo

    console.log('Consultando Correios:', url);

    const response = await fetch(url);
    const xmlText = await response.text();

    // Parsear XML para JSON
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    
    // Extrair informações do XML
    const services = Array.from(xmlDoc.getElementsByTagName('cServico')).map(service => ({
      codigo: service.getElementsByTagName('Codigo')[0]?.textContent,
      valor: service.getElementsByTagName('Valor')[0]?.textContent,
      prazoEntrega: service.getElementsByTagName('PrazoEntrega')[0]?.textContent,
      erro: service.getElementsByTagName('Erro')[0]?.textContent,
      msgErro: service.getElementsByTagName('MsgErro')[0]?.textContent,
    }));

    // Encontrar o menor preço entre os serviços disponíveis
    const availableServices = services.filter(s => s.erro === '0');
    const cheapestService = availableServices.reduce((min, current) => {
      const currentPrice = parseFloat(current.valor.replace(',', '.'));
      const minPrice = parseFloat(min.valor.replace(',', '.'));
      return currentPrice < minPrice ? current : min;
    }, availableServices[0]);

    if (!cheapestService) {
      throw new Error("Nenhum serviço disponível para este trajeto");
    }

    // Converter preço para número
    const finalPrice = parseFloat(cheapestService.valor.replace(',', '.'));

    return new Response(
      JSON.stringify({
        success: true,
        services,
        cheapestService,
        pcFinal: finalPrice
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );

  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      },
    );
  }
});