
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OmieOrderData {
  cabecalho: {
    codigo_cliente: number;
    etapa: string;
    codigo_parcela: string;
    data_previsao: string;
  };
  det: Array<{
    produto: {
      codigo_produto: string;
      quantidade: number;
      valor_unitario: number;
    };
  }>;
  frete: {
    modalidade: string;
    valor_frete: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log do request body completo
    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);

    // Parse do JSON e log dos dados recebidos
    const requestData = JSON.parse(rawBody);
    console.log('Dados recebidos:', requestData);

    const { action, order_id, order_data } = requestData;

    if (!action || !order_id) {
      throw new Error('Ação ou ID do pedido não fornecido');
    }

    if (!order_data || !order_data.profiles) {
      console.error('Dados do pedido inválidos:', order_data);
      throw new Error('Dados do pedido inválidos ou incompletos');
    }

    // Validar dados obrigatórios do cliente
    const requiredFields = ['full_name', 'cpf', 'address', 'city', 'state', 'zip_code'];
    const missingFields = requiredFields.filter(field => !order_data.profiles[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
    }

    // Verificar se o cliente já tem código no Omie
    if (!order_data.profiles.omie_code) {
      throw new Error('Cliente não possui código do Omie. Sincronize o cliente primeiro.');
    }

    // Verificar se há itens no pedido
    if (!order_data.items || order_data.items.length === 0) {
      throw new Error('Pedido não possui itens');
    }

    // Verificar se todos os produtos têm código do Omie
    const invalidProducts = order_data.items.filter(item => !item.omie_code);
    if (invalidProducts.length > 0) {
      throw new Error(`Produtos sem código Omie: ${invalidProducts.map(p => p.name || p.product_id).join(', ')}`);
    }

    // Preparar dados para o Omie
    const omieOrderData: OmieOrderData = {
      cabecalho: {
        codigo_cliente: parseInt(order_data.profiles.omie_code),
        etapa: '10', // Pedido inicial
        codigo_parcela: '000', // À vista
        data_previsao: new Date().toISOString().split('T')[0],
      },
      det: order_data.items.map(item => ({
        produto: {
          codigo_produto: item.omie_code,
          quantidade: item.quantity,
          valor_unitario: item.price
        }
      })),
      frete: {
        modalidade: '1', // Transportadora
        valor_frete: order_data.shipping_fee || 0
      }
    };

    console.log('Dados preparados para envio ao Omie:', omieOrderData);

    // Enviar para o Omie
    const response = await fetch('https://app.omie.com.br/api/v1/produtos/pedido/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'OMIE-APP-KEY': Deno.env.get('OMIE_APP_KEY') || '',
        'OMIE-APP-SECRET': Deno.env.get('OMIE_APP_SECRET') || ''
      },
      body: JSON.stringify({
        call: 'IncluirPedido',
        app_key: Deno.env.get('OMIE_APP_KEY'),
        app_secret: Deno.env.get('OMIE_APP_SECRET'),
        param: [omieOrderData]
      }),
    });

    const responseText = await response.text();
    console.log('Resposta bruta do Omie:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Erro ao parsear resposta:', e);
      throw new Error(`Erro ao parsear resposta do Omie: ${responseText}`);
    }

    if (!response.ok) {
      console.error('Erro na resposta do Omie:', responseData);
      throw new Error(`Erro ao sincronizar com Omie: ${responseData.faultstring || 'Erro desconhecido'}`);
    }

    console.log('Resposta do Omie:', responseData);

    return new Response(JSON.stringify({
      success: true,
      omie_order_id: responseData.codigo_pedido || responseData.codigo_pedido_integracao,
      message: 'Pedido sincronizado com sucesso'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro na função:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erro interno no servidor'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
