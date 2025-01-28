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

    // More aggressive cleaning and sanitization of the HTML content
    const cleanContent = htmlContent
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
      .replace(/[^\x20-\x7E\xA0-\xFF]/g, '') // Only keep printable characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/['"]/g, '') // Remove quotes that might interfere with JSON
      .trim()
      .substring(0, 5000); // Limit input size

    console.log('Processing content with Gemini');
    
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content using Gemini
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
      
      Format the response EXACTLY like this JSON structure (no additional text before or after):
      {
        "title": "The title",
        "summary": "The summary",
        "content": "The full content",
        "tags": "tag1, tag2, tag3"
      }

      Here's the article:
      ${cleanContent}
    `;

    const result = await model.generateContent(prompt);
    const response_text = result.response.text();
    
    console.log('Generated content successfully');

    try {
      // First attempt: Try to parse the response directly
      const generatedContent = JSON.parse(response_text);
      return new Response(JSON.stringify(generatedContent), {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      });
    } catch (parseError) {
      console.log('Direct parsing failed, attempting to extract JSON:', parseError);
      
      // Second attempt: Try to extract JSON using regex and clean it
      const jsonMatch = response_text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('Failed to extract JSON from response:', response_text);
        throw new Error('Failed to parse generated content');
      }

      // Clean the extracted JSON string
      const cleanJson = jsonMatch[0]
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
        .replace(/\\/g, '\\\\') // Escape backslashes
        .replace(/\n/g, '\\n') // Escape newlines
        .replace(/\r/g, '\\r') // Escape carriage returns
        .replace(/\t/g, '\\t'); // Escape tabs

      try {
        const generatedContent = JSON.parse(cleanJson);
        return new Response(JSON.stringify(generatedContent), {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
        });
      } catch (secondParseError) {
        console.error('Failed to parse cleaned JSON:', secondParseError);
        throw new Error('Failed to parse generated content after cleaning');
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