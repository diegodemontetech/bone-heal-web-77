import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    console.log('Fetching content from URL:', url);

    // Fetch the content from the URL
    const response = await fetch(url);
    const htmlContent = await response.text();

    // Extract text content from HTML (basic implementation)
    const textContent = htmlContent.replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    console.log('Processing content with Gemini');
    
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content using Gemini
    const prompt = `
      You are a professional content writer. I want you to read the following article and create a new version of it:
      
      Important Guidelines:
      1. The content should be between 800 and 1,500 words (approximately 4,800 to 9,000 characters)
      2. Make it detailed enough to cover the topic thoroughly but not excessively long
      3. Paraphrase the content to make it unique while maintaining the key information
      4. Create a concise title that captures the main point
      5. Write a brief summary (2-3 sentences)
      6. Generate relevant tags (comma-separated)
      7. VERY IMPORTANT: If the content is in any language other than Portuguese (PT-BR), translate everything to Portuguese (PT-BR)
      
      Format the response as JSON with the following structure:
      {
        "title": "The title",
        "summary": "The summary",
        "content": "The full content",
        "tags": "tag1, tag2, tag3"
      }

      Here's the article:
      ${textContent.substring(0, 5000)} // Limit input size
    `;

    const result = await model.generateContent(prompt);
    const response_text = result.response.text();
    
    console.log('Generated content successfully');

    // Parse the JSON from the response
    const jsonMatch = response_text.match(/\{[\s\S]*\}/);
    const generatedContent = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!generatedContent) {
      throw new Error('Failed to parse generated content');
    }

    return new Response(JSON.stringify(generatedContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-news function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});