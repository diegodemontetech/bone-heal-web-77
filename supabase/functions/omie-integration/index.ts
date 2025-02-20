
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
    const requestData = await req.json();
    console.log('Dados recebidos:', JSON.stringify(requestData, null, 2));

    const { action } = requestData;

    if (action === 'sync_client') {
      return await handleClientSync(requestData);
    } else if (action === 'sync_order') {
      return await handleOrderSync(requestData);
    } else {
      throw new Error('Ação inválida');
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
  const { profile_data } = requestData;

  if (!profile_data) {
    throw new Error('Dados do cliente não fornecidos');
  }

  // Validar dados obrigatórios do cliente
  const requiredFields = ['full_name', 'cpf', 'address', 'city', 'state', 'zip_code'];
  const missingFields = requiredFields.filter(field => !profile_data[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
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

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(`Erro ao sincronizar com Omie: ${responseData.faultstring || 'Erro desconhecido'}`);
  }

  return new Response(JSON.stringify({
    success: true,
    omie_code: responseData.codigo_cliente_omie,
    message: 'Cliente sincronizado com sucesso'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleOrderSync(requestData: any) {
  const { order_id, order_data } = requestData;

  if (!order_id || !order_data) {
    throw new Error('Dados do pedido não fornecidos');
  }

  if (!order_data.profiles?.omie_code) {
    throw new Error('Cliente não possui código do Omie');
  }

  if (!order_data.items?.length) {
    throw new Error('Pedido não possui itens');
  }

  // Validar produtos
  const invalidProducts = order_data.items.filter((item: any) => !item.omie_code);
  if (invalidProducts.length > 0) {
    throw new Error(`Produtos sem código Omie: ${invalidProducts.map((p: any) => p.name).join(', ')}`);
  }

  // Preparar dados para o Omie
  const omieOrderData = {
    cabecalho: {
      codigo_cliente: parseInt(order_data.profiles.omie_code),
      etapa: '10',
      codigo_parcela: '000',
      data_previsao: new Date().toISOString().split('T')[0]
    },
    det: order_data.items.map((item: any) => ({
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

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(`Erro ao sincronizar com Omie: ${responseData.faultstring || 'Erro desconhecido'}`);
  }

  return new Response(JSON.stringify({
    success: true,
    omie_order_id: responseData.codigo_pedido || responseData.codigo_pedido_integracao,
    message: 'Pedido sincronizado com sucesso'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
