
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
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          user_id,
          items
        `)
        .eq('id', order_id)
        .single()

      if (orderError) throw new Error(`Error fetching order: ${orderError.message}`)
      
      // Get customer profile
      const { data: customer, error: customerError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', order.user_id)
        .single()

      if (customerError) throw new Error(`Error fetching customer: ${customerError.message}`)

      // First ensure customer exists in Omie
      console.log('Ensuring customer exists in Omie...')
      const omieCustomer = await ensureCustomerInOmie(customer)
      console.log('Customer processed in Omie:', omieCustomer)

      // Then create order in Omie
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

async function ensureCustomerInOmie(customer: any) {
  try {
    // Prepare customer data based on person type
    const isPessoaFisica = !customer.cnpj || customer.cnpj.trim() === '';
    
    const customerData = {
      codigo_cliente_integracao: customer.id,
      razao_social: customer.full_name,
      nome_fantasia: customer.full_name,
      cnpj_cpf: isPessoaFisica ? (customer.cpf || '').replace(/\D/g, '') : (customer.cnpj || '').replace(/\D/g, ''),
      endereco: customer.address,
      bairro: customer.neighborhood,
      cidade: customer.city,
      estado: customer.state,
      cep: (customer.zip_code || '').replace(/\D/g, ''),
      telefone1: (customer.phone || '').replace(/\D/g, ''),
      email: customer.email,
      pessoa_fisica: isPessoaFisica ? "S" : "N",
      // Default values for Omie requirements
      contribuinte: customer.contribuinte || '9', // 9 = Não contribuinte
      tipo_atividade: customer.tipo_atividade || '0', // 0 = Outros
      endereco_numero: customer.endereco_numero || 'S/N',
      complemento: customer.complemento || '',
      inativo: customer.inativo ? "S" : "N",
      bloqueado: customer.bloqueado ? "S" : "N",
      exterior: customer.exterior ? "S" : "N",
      optante_simples_nacional: customer.optante_simples_nacional ? "S" : "N"
    };

    // Try to find existing customer in Omie
    const findResponse = await fetch(`${OMIE_API_URL}/geral/clientes/`, {
      method: 'POST',
      body: JSON.stringify({
        call: 'ConsultarCliente',
        app_key: omieAppKey,
        app_secret: omieAppSecret,
        param: [{
          codigo_cliente_integracao: customer.id
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

      // Update local database with Omie code
      await supabase
        .from('profiles')
        .update({
          omie_code: createResult.codigo_cliente_omie.toString(),
          omie_sync: true
        })
        .eq('id', customer.id);

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
