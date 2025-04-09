
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

  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 border rounded-lg p-8 text-center">
        <p className="text-gray-500">
          Sem avaliações ainda. Seja o primeiro a avaliar este produto!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewsList;
