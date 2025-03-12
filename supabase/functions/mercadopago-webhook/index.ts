
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Tratamento para preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Recebendo webhook do MercadoPago");
    
    const body = await req.json();
    console.log("Dados recebidos:", JSON.stringify(body, null, 2));

    // Verificar se é uma atualização de pagamento
    if (body.type === 'payment' && body.data?.id) {
      const paymentId = body.data.id;
      console.log(`Processando atualização do pagamento: ${paymentId}`);
      
      // Obter token de acesso MP
      const accessToken = Deno.env.get('MP_ACCESS_TOKEN');
      if (!accessToken) {
        throw new Error("Token do MercadoPago não configurado");
      }

      // Buscar detalhes do pagamento no MP
      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!paymentResponse.ok) {
        throw new Error(`Erro ao buscar dados do pagamento: ${paymentResponse.statusText}`);
      }

      const paymentData = await paymentResponse.json();
      console.log("Dados do pagamento:", JSON.stringify(paymentData, null, 2));

      // Extrair informações importantes
      const externalReference = paymentData.external_reference;
      const status = paymentData.status;
      const paymentMethod = paymentData.payment_method_id;
      const transactionAmount = paymentData.transaction_amount;

      if (!externalReference) {
        throw new Error("Pagamento sem referência externa (ID do pedido)");
      }

      // Mapear status do MP para status interno
      const paymentStatus = status === 'approved' ? 'completed' : 
                            status === 'pending' ? 'pending' : 
                            status === 'rejected' ? 'failed' : 'pending';

      // Atualizar o pagamento no Supabase
      const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
      if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error("Credenciais do Supabase não configuradas");
      }

      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      // Procurar o pagamento existente
      const { data: paymentRecord, error: findError } = await supabase
        .from('payments')
        .select('*')
        .eq('order_id', externalReference)
        .eq('mercadopago_payment_id', paymentId.toString())
        .maybeSingle();

      if (findError) {
        throw new Error(`Erro ao buscar registro de pagamento: ${findError.message}`);
      }

      // Atualizar ou criar o registro de pagamento
      let paymentResult;
      if (paymentRecord) {
        // Atualizar registro existente
        const { data, error } = await supabase
          .from('payments')
          .update({
            status: paymentStatus,
            mercadopago_status: status,
            paid_at: status === 'approved' ? new Date().toISOString() : null
          })
          .eq('id', paymentRecord.id)
          .select()
          .single();

        if (error) throw error;
        paymentResult = data;
      } else {
        // Criar novo registro de pagamento
        const { data, error } = await supabase
          .from('payments')
          .insert({
            order_id: externalReference,
            amount: transactionAmount,
            payment_method: paymentMethod,
            status: paymentStatus,
            mercadopago_payment_id: paymentId.toString(),
            mercadopago_status: status,
            mercadopago_payment_type: paymentData.payment_type_id,
            paid_at: status === 'approved' ? new Date().toISOString() : null
          })
          .select()
          .single();

        if (error) throw error;
        paymentResult = data;
      }

      // Atualizar o status do pedido
      if (status === 'approved') {
        const { error: orderError } = await supabase
          .from('orders')
          .update({ status: 'processing' })
          .eq('id', externalReference);

        if (orderError) {
          console.error("Erro ao atualizar pedido:", orderError);
        }
        
        // Enviar notificação para o cliente
        try {
          // Buscar informações do pedido
          const { data: orderData } = await supabase
            .from('orders')
            .select('*, profiles:user_id(full_name, email, phone)')
            .eq('id', externalReference)
            .single();
            
          if (orderData) {
            // Criar notificação no sistema
            await supabase.from('notifications').insert({
              user_id: orderData.user_id,
              type: 'payment',
              content: `Seu pagamento para o pedido #${externalReference.slice(0, 8)} foi aprovado!`,
              status: 'unread'
            });
            
            // Disparar webhook para o n8n
            const n8nWebhookBase = Deno.env.get('N8N_WEBHOOK_BASE_URL');
            if (n8nWebhookBase) {
              await fetch(`${n8nWebhookBase}/pagamento_aprovado`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  order_id: externalReference,
                  customer_name: orderData.profiles?.full_name,
                  customer_email: orderData.profiles?.email,
                  customer_phone: orderData.profiles?.phone,
                  payment_method: paymentMethod,
                  amount: transactionAmount
                })
              });
            }
          }
        } catch (notifyError) {
          console.error("Erro ao enviar notificação:", notifyError);
        }
      }

      return new Response(
        JSON.stringify({ success: true, status, orderId: externalReference }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Resposta padrão para outros tipos de webhook
    return new Response(
      JSON.stringify({ received: true }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
