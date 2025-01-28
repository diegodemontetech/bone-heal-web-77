import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

export const NewsAIGenerator = ({ onNewsGenerated }: { onNewsGenerated: () => void }) => {
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const generateNews = async () => {
    if (!url) {
      toast.error("Por favor, insira uma URL válida");
      return;
    }

    setIsGenerating(true);
    try {
      // Generate content using the edge function
      const { data: generatedContent, error: generationError } = await supabase.functions
        .invoke('generate-news', {
          body: { url }
        });

      if (generationError) throw generationError;

      // Generate an image based on the title
      const { data: imageData, error: imageError } = await supabase.functions
        .invoke('generate-news-image', {
          body: { prompt: `News article image about: ${generatedContent.title}` }
        });

      if (imageError) {
        console.error('Error generating image:', imageError);
        toast.error("Erro ao gerar imagem, mas continuando com o texto");
      }

      // Create the news entry
      const { error: insertError } = await supabase
        .from('news')
        .insert([
          {
            title: generatedContent.title,
            slug: generatedContent.title.toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-'),
            summary: generatedContent.summary,
            content: generatedContent.content,
            tags: generatedContent.tags,
            featured_image: imageData?.image || null,
            published_at: new Date().toISOString(),
          }
        ]);

      if (insertError) throw insertError;

      toast.success("Notícia gerada e publicada com sucesso!");
      setUrl("");
      onNewsGenerated();
    } catch (error: any) {
      console.error('Error generating news:', error);
      toast.error("Erro ao gerar notícia: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImageForExisting = async (title: string) => {
    setIsGeneratingImage(true);
    try {
      const { data: imageData, error: imageError } = await supabase.functions
        .invoke('generate-news-image', {
          body: { prompt: `News article image about: ${title}` }
        });

      if (imageError) throw imageError;

      toast.success("Imagem gerada com sucesso!");
      return imageData.image;
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast.error("Erro ao gerar imagem: " + error.message);
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex gap-4">
        <Input
          type="url"
          placeholder="Cole a URL da notícia aqui"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={generateNews} 
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Gerar com IA
            </>
          )}
        </Button>
      </div>
    </div>
  );
};