
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    console.log('Dados recebidos:', JSON.stringify(requestData, null, 2));

    const { action } = requestData;

    if (action === 'sync_client') {
      return await handleClientSync(requestData);
    } else if (action === 'sync_order') {
      return await handleOrderSync(requestData);
    } else {
      throw new Error(`Ação inválida: ${action}`);
    }

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

async function handleClientSync(requestData: any) {
  console.log('Iniciando sincronização de cliente...');
  const { profile_data } = requestData;

  if (!profile_data) {
    throw new Error('Dados do cliente não fornecidos');
  }

  console.log('Dados do cliente recebidos:', profile_data);

  // Validar dados obrigatórios do cliente
  const requiredFields = ['full_name', 'address', 'city', 'state', 'zip_code'];
  const missingFields = requiredFields.filter(field => !profile_data[field]);
  
  if (missingFields.length > 0) {
    console.error('Campos faltando:', missingFields);
    throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
  }

  if (!profile_data.cpf && !profile_data.cnpj) {
    throw new Error('CPF ou CNPJ é obrigatório');
  }

  // Dados do cliente para o Omie
  const clientData = {
    codigo_cliente_integracao: profile_data.id,
    razao_social: profile_data.full_name,
    cnpj_cpf: profile_data.cpf || profile_data.cnpj,
    endereco: profile_data.address,
    cidade: profile_data.city,
    estado: profile_data.state,
    cep: profile_data.zip_code,
    telefone1: profile_data.phone || ''
  };

  console.log('Dados preparados para Omie:', clientData);

  try {
    // Enviar para o Omie
    const response = await fetch('https://app.omie.com.br/api/v1/geral/clientes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'OMIE-APP-KEY': Deno.env.get('OMIE_APP_KEY') || '',
        'OMIE-APP-SECRET': Deno.env.get('OMIE_APP_SECRET') || ''
      },
      body: JSON.stringify({
        call: 'IncluirCliente',
        app_key: Deno.env.get('OMIE_APP_KEY'),
        app_secret: Deno.env.get('OMIE_APP_SECRET'),
        param: [clientData]
      })
    });

    const responseText = await response.text();
    console.log('Resposta bruta do Omie:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Erro ao parsear resposta do Omie: ${responseText}`);
    }

    if (!response.ok || !responseData.codigo_cliente_omie) {
      throw new Error(`Erro ao sincronizar com Omie: ${JSON.stringify(responseData)}`);
    }

    console.log('Cliente sincronizado com sucesso:', responseData);

    return new Response(JSON.stringify({
      success: true,
      omie_code: responseData.codigo_cliente_omie,
      message: 'Cliente sincronizado com sucesso'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao sincronizar cliente:', error);
    throw error;
  }
}

async function handleOrderSync(requestData: any) {
  console.log('Iniciando sincronização de pedido...');
  const { order_id, order_data } = requestData;

  if (!order_id) {
    throw new Error('ID do pedido não fornecido');
  }

  if (!order_data) {
    console.error('Dados do pedido ausentes para:', order_id);
    throw new Error('Dados do pedido não fornecidos');
  }

  console.log('Validando dados do pedido:', order_data);

  if (!order_data.profiles) {
    console.error('Dados do cliente ausentes no pedido:', order_id);
    throw new Error('Dados do cliente não encontrados no pedido');
  }

  if (!order_data.profiles.omie_code) {
    console.error('Cliente sem código Omie:', order_data.profiles);
    throw new Error('Cliente não possui código Omie');
  }

  if (!order_data.items || !Array.isArray(order_data.items) || order_data.items.length === 0) {
    console.error('Itens inválidos no pedido:', order_data.items);
    throw new Error('Pedido não possui itens ou formato inválido');
  }

  // Validar produtos
  const invalidProducts = order_data.items.filter(item => !item.omie_code);
  if (invalidProducts.length > 0) {
    console.error('Produtos sem código Omie:', invalidProducts);
    throw new Error(`Produtos sem código Omie: ${invalidProducts.map(p => p.name).join(', ')}`);
  }

  // Preparar dados para o Omie
  const omieOrderData = {
    cabecalho: {
      codigo_cliente: parseInt(order_data.profiles.omie_code),
      etapa: '10',
      codigo_parcela: '000',
      data_previsao: new Date().toISOString().split('T')[0]
    },
    det: order_data.items.map(item => ({
      produto: {
        codigo_produto: item.omie_code,
        quantidade: item.quantity,
        valor_unitario: item.price
      }
    })),
    frete: {
      modalidade: '1',
      valor_frete: order_data.shipping_fee || 0
    }
  };

  console.log('Dados preparados para Omie:', omieOrderData);

  try {
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
      })
    });

    const responseText = await response.text();
    console.log('Resposta bruta do Omie:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Erro ao parsear resposta do Omie: ${responseText}`);
    }

    if (!response.ok) {
      throw new Error(`Erro ao sincronizar com Omie: ${JSON.stringify(responseData)}`);
    }

    console.log('Pedido sincronizado com sucesso:', responseData);

    return new Response(JSON.stringify({
      success: true,
      omie_order_id: responseData.codigo_pedido || responseData.codigo_pedido_integracao,
      message: 'Pedido sincronizado com sucesso'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao sincronizar pedido:', error);
    throw error;
  }
}
