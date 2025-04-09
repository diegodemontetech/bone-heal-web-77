
import { useState } from "react";
import { Product } from "@/types/product";
import ReviewsTab from "./reviews/ReviewsTab";
import { ProductReviewsProps } from "./reviews/types";

const ProductReviews = ({ productId, product }: ProductReviewsProps) => {
  const actualProductId = productId || (product ? product.id : "");

  return (
    <div className="space-y-6">
      {actualProductId ? (
        <ReviewsTab productId={actualProductId} />
      ) : (
        <p className="text-center py-6 text-gray-500">
          ID do produto não encontrado
        </p>
      )}
    </div>
  );
};

export default ProductReviews;
