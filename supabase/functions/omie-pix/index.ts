import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OMIE_APP_KEY = Deno.env.get('OMIE_APP_KEY')!;
const OMIE_APP_SECRET = Deno.env.get('OMIE_APP_SECRET')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OmiePixResponse {
  codigo_status: string;
  codigo_status_processamento: string;
  status_processamento: string;
  cPix: string;
  cLinkPix: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();

    // Buscar informações do pedido no Supabase
    const orderResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}&select=*`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
      },
    });

    const [order] = await orderResponse.json();
    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    // Gerar PIX no Omie
    const omieResponse = await fetch('https://app.omie.com.br/api/v1/produtos/financeiro/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        call: 'GerarPix',
        app_key: OMIE_APP_KEY,
        app_secret: OMIE_APP_SECRET,
        param: [{
          nCodPed: order.omie_order_id,
          nValor: order.total_amount,
        }],
      }),
    });

    const omieData: OmiePixResponse = await omieResponse.json();

    // Atualizar o pedido com as informações do PIX
    const paymentResponse = await fetch(`${SUPABASE_URL}/rest/v1/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        order_id: orderId,
        payment_method: 'pix',
        status: 'pending',
        pix_code: omieData.cPix,
        amount: order.total_amount,
      }),
    });

    if (paymentResponse.status !== 201) {
      throw new Error('Erro ao registrar pagamento');
    }

    return new Response(
      JSON.stringify({
        pixCode: omieData.cPix,
        pixLink: omieData.cLinkPix,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Erro na função omie-pix:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});