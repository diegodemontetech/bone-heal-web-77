
import { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types/product";

interface ProductGalleryProps {
  product: Product;
}

const ProductGallery = ({ product }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(product.main_image || product.default_image_url);

  return (
    <div className="space-y-4">
      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
        <img
          src={selectedImage || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>
      
      {product.gallery && product.gallery.length > 0 && (
        <div className="grid grid-cols-5 gap-4">
          {[product.main_image || product.default_image_url, ...product.gallery].map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`aspect-square rounded-lg overflow-hidden bg-gray-100 hover:ring-2 ring-violet-600 transition-all ${
                selectedImage === image ? "ring-2" : ""
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${product.name} - Imagem ${index + 1}`}
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
