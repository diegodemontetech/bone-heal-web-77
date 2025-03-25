
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProductGalleryProps {
  mainImage: string;
  gallery: string[];
}

const ProductGallery = ({ mainImage, gallery }: ProductGalleryProps) => {
  // Imagem de fallback para quando não houver imagem disponível
  const fallbackImage = "/placeholder.svg";
  
  // Função para obter a URL correta da imagem
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return fallbackImage;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Verificar se a imagem já tem o caminho completo ou apenas o nome do arquivo
    const pathParts = imagePath.split('/');
    const fileName = pathParts[pathParts.length - 1];
    
    try {
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(imagePath);
      
      console.log(`Generated URL for ${imagePath}: ${data.publicUrl}`);
      return data.publicUrl;
    } catch (error) {
      console.error("Erro ao obter URL da imagem:", error);
      return fallbackImage;
    }
  };
  
  const safeMainImage = mainImage ? getImageUrl(mainImage) : fallbackImage;
  const [selectedImage, setSelectedImage] = useState(safeMainImage);

  // Garantir que a galeria seja um array válido
  const safeGallery = Array.isArray(gallery) && gallery.length > 0 
    ? gallery.filter(Boolean).map(img => getImageUrl(img))
    : [];
    
  // Para debug
  useEffect(() => {
    console.log("Imagem principal:", safeMainImage);
    console.log("Galeria de imagens:", safeGallery);
  }, [safeMainImage, safeGallery]);

  // Update selected image if main image changes
  useEffect(() => {
    setSelectedImage(safeMainImage);
  }, [safeMainImage]);

  return (
    <div className="space-y-4">
      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
        <img
          src={selectedImage || fallbackImage}
          alt="Imagem do produto"
          className="w-full h-full object-contain"
          loading="eager"
          onError={(e) => {
            console.error("Erro ao carregar imagem:", selectedImage);
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
      </div>
      
      {(safeMainImage || safeGallery.length > 0) && (
        <div className="grid grid-cols-5 gap-2 mt-2">
          {[safeMainImage, ...safeGallery].filter(Boolean).slice(0, 5).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`aspect-square rounded-lg overflow-hidden bg-gray-100 border hover:border-violet-600 transition-all ${
                selectedImage === image ? "border-violet-600 ring-1 ring-violet-600" : "border-gray-200"
              }`}
            >
              <div className="relative w-full h-full">
                <img
                  src={image}
                  alt={`Imagem ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-contain p-1"
                  loading="eager"
                  onError={(e) => {
                    console.error("Erro ao carregar thumbnail:", image);
                    (e.target as HTMLImageElement).src = fallbackImage;
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
