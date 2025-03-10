
import { useState } from "react";

interface ProductGalleryProps {
  mainImage: string;
  gallery: string[];
}

const ProductGallery = ({ mainImage, gallery }: ProductGalleryProps) => {
  // Imagem de fallback para quando não houver imagem disponível
  const fallbackImage = "https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=1470&auto=format&fit=crop";
  const safeMainImage = mainImage || fallbackImage;
  const [selectedImage, setSelectedImage] = useState(safeMainImage);

  // Garantir que a galeria seja um array válido
  const safeGallery = Array.isArray(gallery) && gallery.length > 0 
    ? gallery.filter(Boolean) 
    : [];

  return (
    <div className="space-y-4">
      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
        <img
          src={selectedImage || fallbackImage}
          alt="Imagem do produto"
          className="w-full h-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
      </div>
      
      {(safeMainImage || safeGallery.length > 0) && (
        <div className="grid grid-cols-5 gap-4">
          {[safeMainImage, ...safeGallery].filter(Boolean).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`aspect-square rounded-lg overflow-hidden bg-gray-100 hover:ring-2 ring-violet-600 transition-all ${
                selectedImage === image ? "ring-2" : ""
              }`}
            >
              <img
                src={image || fallbackImage}
                alt={`Imagem ${index + 1}`}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackImage;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
