
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "@/hooks/use-product-form";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProductDescriptionDetailsProps {
  form: UseFormReturn<ProductFormValues>;
}

const ProductDescriptionDetails = ({ form }: ProductDescriptionDetailsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async () => {
    try {
      const omieCode = form.getValues("omie_code");
      const productName = form.getValues("name");
      
      if (!omieCode) {
        toast.error("É necessário informar o código Omie para gerar o conteúdo");
        return;
      }
      
      setIsGenerating(true);
      
      const { data, error } = await supabase.functions.invoke("generate-product-content", {
        body: { omieCode, productName }
      });
      
      if (error) {
        throw error;
      }
      
      if (data && !data.error) {
        // Atualizar campos do formulário
        form.setValue("short_description", data.short_description, { shouldDirty: true });
        form.setValue("description", data.description, { shouldDirty: true });
        
        toast.success("Conteúdo gerado com sucesso!");
      } else {
        throw new Error(data?.error || "Erro ao gerar conteúdo");
      }
    } catch (error: any) {
      console.error("Erro ao gerar conteúdo:", error);
      toast.error(`Erro ao gerar conteúdo: ${error.message || "Erro desconhecido"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Descrições do Produto</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={generateContent}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Gerar com IA
        </Button>
      </div>
      
      <FormField
        control={form.control}
        name="short_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição Curta</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição Completa</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="video_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Link do Vídeo (YouTube)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://www.youtube.com/watch?v=..." />
            </FormControl>
            <FormDescription>
              Cole aqui o link completo do vídeo do YouTube
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProductDescriptionDetails;
