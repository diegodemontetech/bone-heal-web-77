
import { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types/product";

interface ProductGalleryProps {
  product: Product;
}

const ProductGallery = ({ product }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(product.main_image || product.default_image_url);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
        <img
          src={selectedImage || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>
      
      {product.gallery && product.gallery.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {[product.main_image || product.default_image_url, ...product.gallery].map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`aspect-square rounded-lg overflow-hidden bg-white shadow hover:ring-2 ring-primary transition-all ${
                selectedImage === image ? "ring-2" : ""
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${product.name} - Imagem ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProductGallery;
