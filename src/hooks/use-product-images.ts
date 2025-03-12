
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProductImages = (initialImages: string[] = []) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, maxImages: number) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      console.log("Nenhum arquivo selecionado");
      return;
    }

    console.log("Iniciando upload de", files.length, "arquivo(s)");

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
      // Verificar se o bucket 'products' existe, senão criar
      const { data: bucketsData } = await supabase.storage.listBuckets();
      const bucketExists = bucketsData?.some(bucket => bucket.name === 'products');
      
      if (!bucketExists) {
        await supabase.storage.createBucket('products', {
          public: true
        });
        console.log("Bucket 'products' criado com sucesso");
      }

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        console.log("Tentando fazer upload do arquivo:", fileName);

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("Erro no upload:", uploadError);
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);

        console.log("URL pública gerada:", publicUrlData.publicUrl);
        
        newImages.push(fileName);
        console.log("Imagem enviada com sucesso:", fileName);
      }

      setImages(newImages);
      toast({
        title: "Imagens enviadas com sucesso!",
      });
      return newImages;
    } catch (error: any) {
      console.error("Erro ao fazer upload:", error);
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
