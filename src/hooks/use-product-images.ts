
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProductImages = (initialImages: string[] = []) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, maxImages: number) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Limite de imagens excedido",
        description: `Você pode fazer upload de no máximo ${maxImages} imagens`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const newImages: string[] = [...images];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = fileName;

        // Verificar se o bucket 'products' existe
        const { data: buckets } = await supabase.storage.listBuckets();
        const productBucketExists = buckets?.some(bucket => bucket.name === 'products');
        
        if (!productBucketExists) {
          throw new Error("O bucket 'products' não existe no Supabase Storage");
        }

        // Realizar o upload com tratamento de erros melhorado
        const { error: uploadError, data } = await supabase.storage
          .from('products')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("Erro no upload:", uploadError);
          throw uploadError;
        }

        // Obter a URL pública da imagem
        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        newImages.push(fileName);
        console.log("Imagem enviada com sucesso:", fileName);
      }

      setImages(newImages);
      toast({
        title: "Imagens enviadas com sucesso!",
      });
      return newImages;
    } catch (error: any) {
      console.error("Erro detalhado ao fazer upload:", error);
      toast({
        title: "Erro ao fazer upload das imagens",
        description: error.message,
        variant: "destructive",
      });
      return images;
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    return newImages;
  };

  return {
    images,
    setImages,
    isUploading,
    handleFileUpload,
    removeImage
  };
};
