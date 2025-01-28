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

    if (!url) {
      throw new Error('URL is required');
    }

    // Fetch the content from the URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    
    const htmlContent = await response.text();
    console.log('Raw HTML content length:', htmlContent.length);

    // Aggressive cleaning of the HTML content
    const cleanContent = htmlContent
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
      .replace(/[^\x20-\x7E\xA0-\xFF]/g, '') // Only keep printable characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/['"]/g, '') // Remove quotes
      .replace(/[\\]/g, '') // Remove backslashes
      .trim()
      .substring(0, 5000); // Limit input size

    console.log('Cleaned content length:', cleanContent.length);
    console.log('Processing content with Gemini');
    
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content using Gemini with a more structured prompt
    const prompt = `
      You are a professional content writer. I want you to read the following article and create a new version of it:
      
      Important Guidelines:
      1. The content should be between 800 and 1,500 words
      2. Make it detailed enough to cover the topic thoroughly but not excessively long
      3. Paraphrase the content to make it unique while maintaining the key information
      4. Create a concise title that captures the main point
      5. Write a brief summary (2-3 sentences)
      6. Generate relevant tags (comma-separated)
      7. VERY IMPORTANT: If the content is in any language other than Portuguese (PT-BR), translate everything to Portuguese (PT-BR)
      
      Return ONLY a valid JSON object with this exact structure (no additional text):
      {
        "title": "The title",
        "summary": "The summary",
        "content": "The full content",
        "tags": "tag1, tag2, tag3"
      }

      Here's the article to process:
      ${cleanContent}
    `;

    const result = await model.generateContent(prompt);
    const response_text = result.response.text();
    
    console.log('Generated content successfully');
    console.log('Response text length:', response_text.length);

    // Helper function to clean JSON string
    const cleanJsonString = (str: string) => {
      return str
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
        .replace(/\\/g, '\\\\') // Escape backslashes
        .replace(/\n/g, ' ') // Replace newlines with spaces
        .replace(/\r/g, ' ') // Replace carriage returns with spaces
        .replace(/\t/g, ' ') // Replace tabs with spaces
        .replace(/\s+/g, ' ') // Normalize spaces
        .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3') // Ensure property names are quoted
        .trim();
    };

    try {
      // First attempt: direct parsing
      console.log('Attempting direct JSON parse');
      const generatedContent = JSON.parse(response_text);
      return new Response(JSON.stringify(generatedContent), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (firstError) {
      console.log('Direct parsing failed:', firstError.message);
      
      // Second attempt: extract JSON pattern and clean
      console.log('Attempting to extract JSON pattern');
      const jsonMatch = response_text.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        console.error('No JSON pattern found in response');
        console.log('Response text:', response_text);
        throw new Error('No valid JSON found in response');
      }

      const extractedJson = jsonMatch[0];
      console.log('Extracted JSON length:', extractedJson.length);
      
      const cleanedJson = cleanJsonString(extractedJson);
      console.log('Cleaned JSON length:', cleanedJson.length);

      try {
        const generatedContent = JSON.parse(cleanedJson);
        return new Response(JSON.stringify(generatedContent), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (secondError) {
        console.error('Failed to parse cleaned JSON:', secondError.message);
        console.log('Cleaned JSON string:', cleanedJson);
        throw new Error(`JSON parsing failed after cleaning: ${secondError.message}`);
      }
    }
  } catch (error) {
    console.error('Error in generate-news function:', error);
    console.error('Error details:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }), 
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});