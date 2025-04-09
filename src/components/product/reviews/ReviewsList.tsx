
import { Loader2 } from "lucide-react";
import ReviewItem from "./ReviewItem";
import { sortProductsByBrand } from "@/utils/product-formatters";

interface ReviewsListProps {
  loading: boolean;
  reviews: any[];
}

const ReviewsList = ({ loading, reviews }: ReviewsListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // First sort by brand (Bone Heal first, then Heal Bone),
  // then by rating (highest first), then by date (newest first)
  const sortedReviews = [...reviews].sort((a, b) => {
    // First check product brand - prioritize Bone Heal over Heal Bone
    const aName = a.product_name?.toLowerCase() || '';
    const bName = b.product_name?.toLowerCase() || '';
    
    const aHasBoneHeal = aName.includes('bone heal');
    const bHasBoneHeal = bName.includes('bone heal');
    
    if (aHasBoneHeal && !bHasBoneHeal) return -1;
    if (!aHasBoneHeal && bHasBoneHeal) return 1;
    
    // Then by rating (highest first)
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    
    // Lastly by date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (sortedReviews.length === 0) {
    return (
      <div className="bg-gray-50 border rounded-lg p-8 text-center">
        <p className="text-gray-500">
          Ainda não há avaliações para este produto.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedReviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewsList;
