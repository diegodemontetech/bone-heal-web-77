
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCors, addCorsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  console.log(`Processing ${req.method} request to calculate-shipping`);
  
  // Handle CORS preflight request first
  const corsResponse = handleCors(req);
  if (corsResponse) {
    console.log("Returning CORS preflight response with status 204");
    return corsResponse;
  }

  try {
    // Parse request body
    let body: any = {};
    try {
      body = await req.json();
    } catch (e) {
      console.error("Failed to parse request body:", e);
      body = {}; // Use empty object if parsing fails
    }
    
    const zipCode = body.zipCode || body.zipCodeDestination || "";
    
    console.log(`Calculating shipping for ZIP: ${zipCode}`);
    
    // Basic ZIP code validation
    if (!zipCode) {
      const errorResponse = new Response(
        JSON.stringify({
          rates: [],
          success: false,
          error: "ZIP code not provided"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 // Using 200 instead of 400 to bypass CORS issues
        }
      );
      return addCorsHeaders(errorResponse);
    }
    
    // Clean ZIP code to have only numbers
    const cleanZipCode = zipCode.toString().replace(/\D/g, '');
    
    if (cleanZipCode.length !== 8) {
      const errorResponse = new Response(
        JSON.stringify({
          rates: [],
          success: false,
          error: "Invalid ZIP code: must contain 8 digits"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 // Using 200 instead of 400 to bypass CORS issues
        }
      );
      return addCorsHeaders(errorResponse);
    }

    // Generate shipping rates
    const shippingRates = generateFallbackRates(cleanZipCode);
    
    console.log(`Returning ${shippingRates.length} shipping rates`);

    const successResponse = new Response(
      JSON.stringify({ 
        rates: shippingRates, 
        success: true 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    );
    
    return addCorsHeaders(successResponse);

  } catch (error) {
    console.error('Error in calculate-shipping function:', error);
    
    // Generate default shipping rates in case of error
    let zipCode = "00000000";
    try {
      const bodyData = await req.json();
      zipCode = (bodyData.zipCode || bodyData.zipCodeDestination || "00000000").toString().replace(/\D/g, '');
    } catch (e) {
      console.error("Failed to parse request body for fallback:", e);
    }
    
    const fallbackRates = generateFallbackRates(zipCode);
    
    const errorResponse = new Response(
      JSON.stringify({ 
        rates: fallbackRates, 
        success: true, 
        error: error instanceof Error ? error.message : String(error), 
        message: "Using default shipping rates due to an error" 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    );
    
    return addCorsHeaders(errorResponse);
  }
});

function generateFallbackRates(zipCode: string): any[] {
  const zipPrefix = zipCode.substring(0, 3);
  let baseFee = 25;
  let days = 7;
  
  // Adjust shipping based on region (simplified version)
  if (['010', '011', '012', '013', '014', '015'].includes(zipPrefix)) {
    // São Paulo capital
    baseFee = 20;
    days = 3;
  } else if (parseInt(zipPrefix) >= 10 && parseInt(zipPrefix) <= 199) {
    // São Paulo state
    baseFee = 25;
    days = 4;
  }
  
  return [
    {
      id: "sedex",
      service_type: "Sedex",
      name: "Sedex - Entrega Rápida",
      rate: baseFee + 5,
      delivery_days: Math.max(2, days - 3),
      zipCode
    },
    {
      id: "pac",
      service_type: "PAC",
      name: "PAC - Entrega Econômica",
      rate: baseFee,
      delivery_days: days,
      zipCode
    }
  ];
}
