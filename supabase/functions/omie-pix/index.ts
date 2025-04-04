
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
    
    // Simulação de resposta do OMIE com formato compatível
    const pixCode = `00020101021226880014br.gov.bcb.pix2566qrcodes-pix.mercadopago.com/pd/v2/70c5989a-9a48-4b87-84c2-46936f9b8aa552040000530398654041.005802BR5925BONEHEAL PRODUTOS MEDICOS6009SAO PAULO62070503***6304${Math.floor(Math.random() * 10000)}`;
    const pixLink = "https://pix.boneheal.com.br/" + orderId;
    // Gerar base64 image para QR code apenas para fins de simulação
    const qrCodeImage = "iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURQAAAAICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOTk5SUlJWVlZaWlpeXl5iYmJmZmZqampubm5ycnJ2dnZ6enp+fn6CgoKGhoaKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t/f3+Dg4OHh4eLi4uPj4+Tk5OXl5ebm5ufn5+jo6Onp6erq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v///ywHQ3IAAAGgSURBVO4y3b8N1u2mAMCCPMf2/Z9z3TZZlmVZZnIYyCE+gAN8gAd4Aw/wCrKsVav2b25uVFW//yRZK60WgC98ZkjyHjTSCbFRoLTSh6oq0D5D5sZMIVnfrA5q2btj7Mu4lKdQVfWYbYY2FeOUj8FZozOklJI8Z29LNZUT5JQsZ+vEVE3rBDMlXdeKqYr6CVbfSKvl2hv1lnbtjaEo6tRkNBQU2jFqipYaLcYMTS6tZsTUJHqEQVMjmFdTUzOYkjZPDSRq5jP5ZshkMZPLZDWZXSazlqyWclnKZSmXBv+vfAQ5EnI85BDJkZKDKK8JObTkmpFrTK7FOYb1zJBzTs5tOQfm2ppzde8NPRbkmJFjSo45Ofb5nJ11gA4mOsjkJJST1U/mnQwcGMdCoaiDM6ZMneZpnucj6TuY6c0XTDjv1PU3jsPxOI5Ht9ttHPf77TbcrOF2nIbxdpxuxuvhPBzXsb+OfX8+nc7n09CP48d1HM/7+X1fL5f9crmc9/U8nz+nqZ/6vm/bmBTnS3e9/KbA/zLfL5/Jfrqe+2G4DcPH/fVu/PU0vQ4/I376B9t3dAM7YQQ6AAAAAElFTkSuQmCC";
    
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
