
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const omieAppKey = Deno.env.get('OMIE_APP_KEY')!;
const omieAppSecret = Deno.env.get('OMIE_APP_SECRET')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const OMIE_API_URL = 'https://app.omie.com.br/api/v1';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, order_id } = await req.json()
    console.log(`Processing ${action} for order ${order_id}`)

    if (action === 'sync_order') {
      // Fetch order with detailed customer information
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          user:user_id (
            id,
            profiles (
              *,
              city_data:ibge_cities!inner(
                *,
                state:ibge_states!inner(*)
              )
            )
          )
        `)
        .eq('id', order_id)
        .single()

      if (orderError) throw new Error(`Error fetching order: ${orderError.message}`)
      if (!order) throw new Error(`Order not found: ${order_id}`)
      
      const profile = order.user?.profiles?.[0]
      if (!profile) throw new Error(`Profile not found for user: ${order.user_id}`)
      
      // Get IBGE data
      const cityData = profile.city_data?.[0]
      if (!cityData) throw new Error(`City IBGE data not found for profile: ${profile.id}`)

      console.log('Ensuring customer exists in Omie...')
      const omieCustomer = await ensureCustomerInOmie(profile, cityData)
      console.log('Customer processed in Omie:', omieCustomer)

      console.log('Creating order in Omie...')
      const omieOrder = await createOmieOrder(order, omieCustomer)
      console.log('Order created in Omie:', omieOrder)

      // Update order with Omie details
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          omie_order_id: omieOrder.codigo_pedido,
          omie_status: 'novo',
          omie_last_sync_attempt: new Date().toISOString(),
        })
        .eq('id', order_id)

      if (updateError) throw new Error(`Error updating order: ${updateError.message}`)

      return new Response(
        JSON.stringify({ success: true, data: omieOrder }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error(`Unknown action: ${action}`)

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Always return 200 to avoid edge function issues
      }
    )
  }
})

async function ensureCustomerInOmie(profile: any, cityData: any) {
  try {
    // Prepare customer data based on person type
    const isPessoaFisica = !profile.cnpj || profile.cnpj.trim() === '';
    
    const customerData = {
      codigo_cliente_integracao: profile.id,
      razao_social: profile.full_name,
      nome_fantasia: profile.full_name,
      cnpj_cpf: isPessoaFisica ? (profile.cpf || '').replace(/\D/g, '') : (profile.cnpj || '').replace(/\D/g, ''),
      endereco: profile.address,
      endereco_numero: profile.endereco_numero || 'S/N',
      complemento: profile.complemento || '',
      bairro: profile.neighborhood,
      estado: profile.state,
      cidade: profile.city,
      estado_ibge: cityData.state.ibge_code,
      cidade_ibge: cityData.ibge_code,
      cep: (profile.zip_code || '').replace(/\D/g, ''),
      telefone1: (profile.phone || '').replace(/\D/g, ''),
      email: profile.email,
      pessoa_fisica: isPessoaFisica ? "S" : "N",
      contribuinte: profile.contribuinte || '9',
      tipo_atividade: profile.tipo_atividade || '0',
      inativo: profile.inativo ? "S" : "N",
      bloqueado: profile.bloqueado ? "S" : "N",
      exterior: profile.exterior ? "S" : "N",
      optante_simples_nacional: profile.optante_simples_nacional ? "S" : "N"
    };

    // Try to find existing customer in Omie
    const findResponse = await fetch(`${OMIE_API_URL}/geral/clientes/`, {
      method: 'POST',
      body: JSON.stringify({
        call: 'ConsultarCliente',
        app_key: omieAppKey,
        app_secret: omieAppSecret,
        param: [{
          codigo_cliente_integracao: profile.id
        }]
      })
    });

    const findResult = await findResponse.json();
    
    if (findResult.faultstring) {
      // Customer doesn't exist, create new
      console.log('Creating new customer in Omie...');
      const createResponse = await fetch(`${OMIE_API_URL}/geral/clientes/`, {
        method: 'POST',
        body: JSON.stringify({
          call: 'IncluirCliente',
          app_key: omieAppKey,
          app_secret: omieAppSecret,
          param: [customerData]
        })
      });

      const createResult = await createResponse.json();
      if (createResult.faultstring) {
        throw new Error(`Error creating client: ${createResult.faultstring}`);
      }

      return { ...customerData, codigo_cliente_omie: createResult.codigo_cliente_omie };
    }

    // Customer exists, update
    console.log('Updating existing customer in Omie...');
    const updateResponse = await fetch(`${OMIE_API_URL}/geral/clientes/`, {
      method: 'POST',
      body: JSON.stringify({
        call: 'AlterarCliente',
        app_key: omieAppKey,
        app_secret: omieAppSecret,
        param: [{
          ...customerData,
          codigo_cliente_omie: findResult.codigo_cliente_omie
        }]
      })
    });

    const updateResult = await updateResponse.json();
    if (updateResult.faultstring) {
      throw new Error(`Error updating client: ${updateResult.faultstring}`);
    }

    return { ...customerData, codigo_cliente_omie: findResult.codigo_cliente_omie };
  } catch (error) {
    console.error('Error in ensureCustomerInOmie:', error);
    throw error;
  }
}

async function createOmieOrder(order: any, customer: any) {
  try {
    const orderItems = order.items.map((item: any) => ({
      codigo_produto: item.omie_code,
      quantidade: item.quantity,
      valor_unitario: item.price,
      tipo_desconto: 'V',
      desconto: 0
    }));

    const orderData = {
      codigo_cliente: customer.codigo_cliente_omie,
      codigo_pedido_integracao: order.id,
      data_previsao: new Date().toISOString().split('T')[0],
      quantidade_itens: orderItems.length,
      itens_pedido: orderItems,
      codigo_parcela: '999', // À vista
      qtde_parcelas: 1,
    };

    const response = await fetch(`${OMIE_API_URL}/produtos/pedido/`, {
      method: 'POST',
      body: JSON.stringify({
        call: 'IncluirPedido',
        app_key: omieAppKey,
        app_secret: omieAppSecret,
        param: [orderData]
      })
    });

    const result = await response.json();
    if (result.faultstring) {
      throw new Error(`Error creating order in Omie: ${result.faultstring}`);
    }

    return result;
  } catch (error) {
    console.error('Error in createOmieOrder:', error);
    throw error;
  }
}
