import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ShippingRequest {
  zipCodeOrigin: string;
  zipCodeDestination: string;
  weight: number; // in kg
  length: number; // in cm
  width: number;  // in cm
  height: number; // in cm
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CORREIOS_TOKEN = Deno.env.get('CORREIOS_TOKEN');
    if (!CORREIOS_TOKEN) {
      console.error('Correios token not configured');
      throw new Error('Correios token not configured');
    }

    const { zipCodeOrigin, zipCodeDestination, weight, length, width, height } = await req.json() as ShippingRequest;

    // Correios API endpoint for price calculation
    const url = 'https://api.correios.com.br/preco/v1/nacional/calculo';

    // Format the request body according to Correios API specifications
    const requestBody = {
      coProduto: '03220', // PAC
      cepOrigem: zipCodeOrigin.replace(/\D/g, ''),
      cepDestino: zipCodeDestination.replace(/\D/g, ''),
      psObjeto: weight,
      tpObjeto: '2', // Package
      comprimento: length,
      largura: width,
      altura: height,
      servicosAdicionais: [],
    };

    console.log('Calculating shipping for:', requestBody);
    console.log('Using Correios token:', CORREIOS_TOKEN.substring(0, 10) + '...');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CORREIOS_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Correios API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      
      if (response.status === 403) {
        throw new Error('Invalid or expired Correios token');
      }
      
      throw new Error(`Correios API error: ${response.status}`);
    }

    const shippingData = await response.json();
    console.log('Shipping calculation result:', shippingData);

    return new Response(
      JSON.stringify(shippingData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error calculating shipping:', error);
    
    // Determine if it's a token issue
    const isAuthError = error.message.includes('token');
    const statusCode = isAuthError ? 401 : 500;
    const errorMessage = isAuthError 
      ? 'Invalid or expired Correios token. Please update the token in Supabase settings.'
      : error.message;

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: statusCode,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});