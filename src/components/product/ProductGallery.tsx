
import { useState } from "react";

interface ProductGalleryProps {
  mainImage: string;
  gallery: string[];
}

const ProductGallery = ({ mainImage, gallery }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(mainImage);

  return (
    <div className="space-y-4">
      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
        <img
          src={selectedImage || "/placeholder.svg"}
          alt="Imagem do produto"
          className="w-full h-full object-contain"
        />
      </div>
      
      {gallery && gallery.length > 0 && (
        <div className="grid grid-cols-5 gap-4">
          {[mainImage, ...gallery].map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`aspect-square rounded-lg overflow-hidden bg-gray-100 hover:ring-2 ring-violet-600 transition-all ${
                selectedImage === image ? "ring-2" : ""
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Imagem ${index + 1}`}
                className="w-full h-full object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
