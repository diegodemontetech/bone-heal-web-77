
// Define CORS headers to allow cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, range, x-client-info, preferanonymous',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
  'Access-Control-Max-Age': '86400'
};

// Helper function to handle OPTIONS preflight requests
export const handleCors = (req: Request): Response | null => {
  console.log(`Handling ${req.method} request with CORS headers`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request for CORS');
    return new Response(null, {
      status: 204, // Use 204 No Content for OPTIONS
      headers: corsHeaders
    });
  }
  
  // For other requests, return null and let the function handle it
  return null;
};

// Helper to wrap any response with CORS headers
export const addCorsHeaders = (response: Response): Response => {
  const newHeaders = new Headers(response.headers);
  
  // Add all CORS headers to the response
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
};
