
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

export const NewsAIGenerator = ({ onNewsGenerated }: { onNewsGenerated: () => void }) => {
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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

      if (generationError) {
        console.error('Erro ao gerar conteúdo:', generationError);
        throw new Error(`Erro ao gerar conteúdo: ${generationError.message}`);
      }

      if (!generatedContent || !generatedContent.title) {
        throw new Error('Conteúdo gerado inválido ou vazio');
      }

      console.log('Conteúdo gerado:', generatedContent);

      // Generate an image based on the title
      const { data: imageData, error: imageError } = await supabase.functions
        .invoke('generate-news-image', {
          body: { prompt: `Imagem para notícia sobre: ${generatedContent.title}` }
        });

      if (imageError) {
        console.error('Erro ao gerar imagem:', imageError);
        toast.error("Erro ao gerar imagem, mas continuando com o texto");
      }

      // Criar o slug baseado no título
      const slug = generatedContent.title.toLowerCase()
        .replace(/[^\w\sàáâãéêíóôõúüçÀÁÂÃÉÊÍÓÔÕÚÜÇ-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      // Create the news entry
      const { error: insertError } = await supabase
        .from('news')
        .insert([
          {
            title: generatedContent.title,
            slug: slug,
            summary: generatedContent.summary,
            content: generatedContent.content,
            tags: generatedContent.tags,
            featured_image: imageData?.image || null,
            published_at: new Date().toISOString(),
          }
        ]);

      if (insertError) {
        console.error('Erro ao inserir notícia:', insertError);
        throw insertError;
      }

      toast.success("Notícia gerada e publicada com sucesso!");
      setUrl("");
      onNewsGenerated();
    } catch (error: any) {
      console.error('Erro completo ao gerar notícia:', error);
      toast.error("Erro ao gerar notícia: " + error.message);
    } finally {
      setIsGenerating(false);
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
