import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProductImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const ProductImageUpload = ({ images = [], onChange, maxImages = 3 }: ProductImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        newImages.push(fileName);
      }

      onChange(newImages);
      toast({
        title: "Imagens enviadas com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao fazer upload das imagens",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
            <img
              src={`/products/${image}`}
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-red-50"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <div className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <div className="text-center p-4">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  <Button variant="outline" disabled={isUploading}>
                    Adicionar Imagem
                  </Button>
                )}
              </div>
            </label>
          </div>
        )}
      </div>
      <p className="text-sm text-neutral-500">
        Faça upload de até {maxImages} imagens. A primeira imagem será a principal.
      </p>
    </div>
  );
};

export default ProductImageUpload;