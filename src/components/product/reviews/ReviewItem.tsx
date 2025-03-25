
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import StarRating from "./StarRating";
import { ReviewItemProps } from "./types";

const ReviewItem = ({ review }: ReviewItemProps) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start gap-3 mb-2">
        <Avatar className="h-10 w-10">
          <AvatarFallback>{review.user_name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="font-medium">{review.user_name}</span>
            <span className="text-sm text-gray-500">
              {new Date(review.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <StarRating rating={review.rating} />
          <p className="mt-2 text-gray-700">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
