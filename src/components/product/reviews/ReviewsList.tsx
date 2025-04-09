
import { Loader2 } from "lucide-react";
import ReviewItem from "./ReviewItem";

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

  // If there are no reviews, return null instead of showing a message
  if (reviews.length === 0) {
    return null;
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

  return (
    <div className="space-y-6">
      {sortedReviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewsList;
