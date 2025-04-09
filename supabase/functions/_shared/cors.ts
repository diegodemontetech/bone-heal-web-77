
// Define CORS headers to allow cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, origin, accept',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400'
}

// Helper function to handle OPTIONS preflight requests
export const handleCors = (req: Request): Response | null => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request for CORS');
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }
  
  // For other requests, return null and let the function handle it
  return null;
}
