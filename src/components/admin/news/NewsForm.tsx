
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Wand2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewsFormProps {
  editingId: string | null;
  formData: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    featured_image: string;
    category: string;
    tags: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    title: string;
    slug: string;
    summary: string;
    content: string;
    featured_image: string;
    category: string;
    tags: string;
  }>>;
  handleCloseForm: () => void;
  refetch: () => void;
}

export const NewsForm = ({
  editingId,
  formData,
  setFormData,
  handleCloseForm,
  refetch,
}: NewsFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const updateNewsMutation = useMutation({
    mutationFn: async (data: typeof formData & { id: string }) => {
      const { error } = await supabase
        .from("news")
        .update({
          title: data.title,
          slug: data.title.toLowerCase().replace(/ /g, "-"),
          summary: data.summary,
          content: data.content,
          featured_image: data.featured_image,
          category: data.category,
          tags: data.tags,
        })
        .eq("id", data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      toast({ title: "Notícia atualizada com sucesso" });
      handleCloseForm();
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar notícia",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = async (file: File) => {
    if (!file) return null;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('news_images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('news_images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Erro ao fazer upload da imagem",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const generateImageWithAI = async () => {
    if (!formData.title) {
      toast({
        title: "Erro",
        description: "Por favor, insira um título antes de gerar a imagem",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions
        .invoke('generate-news-image', {
          body: { prompt: `News article image about: ${formData.title}` }
        });

      if (error) throw error;

      setFormData(prev => ({
        ...prev,
        featured_image: data.image
      }));

      toast({
        title: "Imagem gerada com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao gerar imagem",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let featured_image = formData.featured_image;

    if (selectedImage) {
      const uploadedUrl = await handleImageUpload(selectedImage);
      if (uploadedUrl) {
        featured_image = uploadedUrl;
      }
    }

    try {
      if (editingId) {
        updateNewsMutation.mutate({
          ...formData,
          featured_image,
          id: editingId,
        });
      } else {
        const { error } = await supabase
          .from("news")
          .insert([
            {
              ...formData,
              featured_image,
              slug: formData.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, "-"),
              published_at: new Date().toISOString(),
            },
          ]);
  
        if (error) {
          toast({
            title: "Erro ao criar notícia",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
  
        toast({
          title: "Notícia criada com sucesso",
        });
        handleCloseForm();
        refetch();
      }
    } catch (error: any) {
      toast({
        title: "Erro ao salvar notícia",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Categoria</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="image">Imagem Destacada</Label>
        <div className="space-y-4">
          {formData.featured_image && (
            <img
              src={formData.featured_image}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/800x400/png?text=Preview+indisponível";
              }}
            />
          )}
          <div className="flex gap-4">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedImage(file);
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={generateImageWithAI}
              disabled={isGeneratingImage}
            >
              {isGeneratingImage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
      <div>
        <Label htmlFor="summary">Resumo</Label>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="content">Conteúdo</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          className="min-h-[200px]"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isUploading}>
        {isUploading ? "Enviando..." : editingId ? "Atualizar Notícia" : "Criar Notícia"}
      </Button>
    </form>
  );
};
