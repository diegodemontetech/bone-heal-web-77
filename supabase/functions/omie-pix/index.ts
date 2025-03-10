
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
    console.log("Recebida solicitação para gerar PIX para o pedido:", orderId);

    if (!orderId) {
      throw new Error("ID do pedido não fornecido");
    }

    if (!OMIE_APP_KEY || !OMIE_APP_SECRET) {
      throw new Error("Credenciais da API Omie não configuradas");
    }

    // Buscar informações do pedido no Supabase
    console.log("Buscando informações do pedido no Supabase...");
    const orderResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}&select=*`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
      },
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      throw new Error(`Erro ao buscar pedido: ${orderResponse.status} - ${errorText}`);
    }

    const orders = await orderResponse.json();
    
    if (!orders || orders.length === 0) {
      throw new Error('Pedido não encontrado');
    }
    
    const order = orders[0];
    console.log("Detalhes do pedido recuperados:", order.id, "valor:", order.total_amount);

    // Verificar se já existe um código PIX para este pedido
    console.log("Verificando se já existe um pagamento PIX...");
    const paymentResponse = await fetch(`${SUPABASE_URL}/rest/v1/payments?order_id=eq.${orderId}&payment_method=eq.pix&select=*`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
      },
    });

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      throw new Error(`Erro ao verificar pagamentos: ${paymentResponse.status} - ${errorText}`);
    }

    const payments = await paymentResponse.json();
    
    // Se já existe um código PIX, retorná-lo
    if (payments && payments.length > 0 && payments[0].pix_code) {
      console.log("Código PIX já existe, retornando...");
      return new Response(
        JSON.stringify({
          pixCode: payments[0].pix_code,
          pixLink: payments[0].pix_link || "",
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Gerar PIX via simulação (para desenvolvimento)
    // Em produção, substituir pelo código real de integração com o Omie
    console.log("Gerando código PIX simulado...");
    
    // Simulação de resposta do OMIE com formato compatível
    const pixCode = `00020101021226880014br.gov.bcb.pix2566qrcodes-pix.mercadopago.com/pd/v2/70c5989a-9a48-4b87-84c2-46936f9b8aa552040000530398654041.005802BR5925BONEHEAL PRODUTOS MEDICOS6009SAO PAULO62070503***6304${Math.floor(Math.random() * 10000)}`;
    const pixLink = "https://pix.boneheal.com.br/" + orderId;
    
    const omieData: OmiePixResponse = {
      codigo_status: "0",
      codigo_status_processamento: "0",
      status_processamento: "processado",
      cPix: pixCode,
      cLinkPix: pixLink
    };

    // Atualizar o pedido com as informações do PIX
    console.log("Registrando informações do PIX no banco de dados...");
    
    // Verificar se já existe um registro de pagamento
    if (payments && payments.length > 0) {
      // Atualizar o registro existente
      const updatePaymentResponse = await fetch(`${SUPABASE_URL}/rest/v1/payments?id=eq.${payments[0].id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          pix_code: omieData.cPix,
          pix_link: omieData.cLinkPix,
          updated_at: new Date().toISOString()
        }),
      });

      if (!updatePaymentResponse.ok) {
        const errorText = await updatePaymentResponse.text();
        throw new Error(`Erro ao atualizar pagamento: ${updatePaymentResponse.status} - ${errorText}`);
      }
    } else {
      // Criar um novo registro de pagamento
      const newPaymentResponse = await fetch(`${SUPABASE_URL}/rest/v1/payments`, {
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
          pix_link: omieData.cLinkPix,
          amount: order.total_amount,
        }),
      });

      if (newPaymentResponse.status !== 201) {
        const errorText = await newPaymentResponse.text();
        throw new Error(`Erro ao registrar pagamento: ${newPaymentResponse.status} - ${errorText}`);
      }
    }

    console.log("PIX gerado e registrado com sucesso!");
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
