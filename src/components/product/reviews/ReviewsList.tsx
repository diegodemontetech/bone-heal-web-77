
import { Loader2 } from "lucide-react";
import ReviewItem from "./ReviewItem";

interface ReviewsListProps {
  loading: boolean;
  reviews: any[];
}

const ReviewsList = ({ loading, reviews }: ReviewsListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="text-center py-6 text-gray-500">
        Sem avaliações ainda. Seja o primeiro a avaliar este produto!
      </p>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewsList;
