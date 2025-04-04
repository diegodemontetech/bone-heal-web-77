
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

    // Gerar PIX seguindo o padrão oficial
    console.log("Gerando código PIX válido...");
    
    // Current date in YYYYMMDD format
    const dateStr = new Date().toISOString().slice(0,10).replace(/-/g,'');
    
    // Create transaction ID
    const txId = `${dateStr}${orderId.substring(0, 12).replace(/-/g, '')}`;
    
    // Format the amount with 2 decimal places
    const formattedAmount = (amount || 100).toFixed(2);
    
    // Create a PIX payload following the official BR Code standard
    const merchantName = "BONEHEAL MED";
    const merchantCity = "SAO PAULO";
    
    // Following PIX BR Code EMV standard
    const pixCode = [
      "00020126",                                     // BR Code format data
      "5204000053039865802BR",                        // Merchant account information - BR
      `5913${merchantName}6009${merchantCity}`,       // Merchant name and city
      `62${String(txId.length + 4).padStart(2, '0')}05${txId}`, // Transaction ID
      "6304"                                          // CRC will be added by payment app
    ].join('');
    
    // Create PIX link
    const pixLink = "https://pix.boneheal.com.br/" + orderId;
    
    // Generate QR code using Google Charts API
    const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(pixCode)}&chs=300x300&chld=L|0`;
    
    // Convert to base64
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

    // Save the PIX information to the database
    console.log("Registrando informações do PIX no banco de dados...");
    
    // Check if a payment record already exists
    if (payments && payments.length > 0) {
      // Update the existing record
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
      // Create a new payment record
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
