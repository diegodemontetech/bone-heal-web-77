
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface RequestBody {
  orderId: string;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
  }>;
  buyer: {
    name: string;
    email: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('Invalid token')
    }

    const { orderId, items, buyer } = await req.json() as RequestBody

    // Criar preferência no Mercado Pago
    const preference = {
      items,
      payer: {
        name: buyer.name,
        email: buyer.email,
      },
      back_urls: {
        success: `${req.headers.get('origin')}/checkout/success`,
        failure: `${req.headers.get('origin')}/checkout/failure`,
        pending: `${req.headers.get('origin')}/checkout/pending`,
      },
      auto_return: "approved",
      external_reference: orderId,
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook`,
    }

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('MP_ACCESS_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    })

    if (!mpResponse.ok) {
      throw new Error(`Mercado Pago error: ${await mpResponse.text()}`)
    }

    const mpData = await mpResponse.json()

    // Atualizar o pedido com o ID da preferência
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({ mp_preference_id: mpData.id })
      .eq('id', orderId)
      .eq('user_id', user.id)

    if (updateError) {
      throw new Error(`Error updating order: ${updateError.message}`)
    }

    return new Response(
      JSON.stringify(mpData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
