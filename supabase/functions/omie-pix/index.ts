
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

const OMIE_APP_KEY = Deno.env.get('OMIE_APP_KEY')!;
const OMIE_APP_SECRET = Deno.env.get('OMIE_APP_SECRET')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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
    const { orderId, amount } = await req.json();
    console.log("Recebida solicitação para gerar PIX para o pedido:", orderId, "valor:", amount);

    if (!orderId) {
      throw new Error("ID do pedido não fornecido");
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
          pixQrCodeImage: payments[0].pix_qr_code_image || "",
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Gerar PIX simulado (para desenvolvimento)
    console.log("Gerando código PIX simulado...");
    
    // Gerar um código PIX que segue o formato padrão, incluindo o nome BoneHeal
    const orderHex = orderId.replace(/-/g, '').substring(0, 20);
    const totalAmount = (amount || 100).toFixed(2);
    const pixCode = `00020126580014BR.GOV.BCB.PIX0136${orderHex}0214${totalAmount}5204000053039865802BR5913BONEHEAL MED6009SAO PAULO62150503${orderHex.substring(0, 4)}63047A91`;
    
    const pixLink = "https://pix.boneheal.com.br/" + orderId;
    
    // Gerar QR code usando Google Charts API
    const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(pixCode)}&chs=300x300&chld=L|0`;
    
    // Converter para base64 (simulando)
    let qrCodeImage = "";
    try {
      const qrCodeResponse = await fetch(qrCodeUrl);
      if (qrCodeResponse.ok) {
        const arrayBuffer = await qrCodeResponse.arrayBuffer();
        qrCodeImage = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      } else {
        console.error("Error fetching QR code image:", qrCodeResponse.statusText);
      }
    } catch (error) {
      console.error("Error converting QR code to base64:", error);
    }
    
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
          pix_qr_code_image: qrCodeImage,
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
          pix_qr_code_image: qrCodeImage,
          amount: amount || order.total_amount,
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
        pixQrCodeImage: qrCodeImage,
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
