
import { useState } from "react";

interface ProductImageSectionProps {
  mainImage?: string;
  defaultImageUrl?: string;
  productName: string;
}

const ProductImageSection = ({ mainImage, defaultImageUrl, productName }: ProductImageSectionProps) => {
  const fallbackImage = "/placeholder.svg";
  const imageUrl = mainImage 
    ? `https://kurpshcdafxbyqnzxvxu.supabase.co/storage/v1/object/public/products/${mainImage}` 
    : defaultImageUrl || fallbackImage;

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm flex items-center justify-center">
      <img
        src={imageUrl}
        alt={productName}
        className="max-h-96 object-contain"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = fallbackImage;
        }}
      />
    </div>
  );
};

export default ProductImageSection;
