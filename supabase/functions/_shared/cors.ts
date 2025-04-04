
// Headers CORS compartilhados para todas as funções
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
  'Access-Control-Max-Age': '86400'
};

// Helper function for handling CORS preflight requests
export const handleCors = (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      status: 200,
      headers: corsHeaders
    });
  }
  
  return null;
};
