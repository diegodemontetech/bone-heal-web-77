
import { Loader2, X, Upload } from "lucide-react";
import { useProductImages } from "@/hooks/use-product-images";
import { supabase } from "@/integrations/supabase/client";

interface ProductImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const ProductImageUpload = ({ images: initialImages = [], onChange, maxImages = 3 }: ProductImageUploadProps) => {
  const { 
    images,
    isUploading,
    handleFileUpload,
    removeImage
  } = useProductImages(initialImages);

  // Propagar mudanças para o componente pai
  const handleImagesChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newImages = await handleFileUpload(event, maxImages);
    if (newImages) {
      onChange(newImages);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = removeImage(index);
    onChange(newImages);
  };

  const getImageUrl = (path: string) => {
    if (path.startsWith('http')) {
      return path;
    }
    
    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(path);
    
    return data.publicUrl;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
            <img
              src={getImageUrl(image)}
              alt={`Imagem do produto ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Erro ao carregar imagem:", image);
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-red-50"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <div className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center relative">
            <input
              type="file"
              accept="image/*"
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleImagesChange}
              disabled={isUploading}
            />
            <div className="text-center p-4">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-neutral-400" />
                  <span className="text-sm text-neutral-500">Clique para adicionar</span>
                </div>
              )}
            </div>
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
