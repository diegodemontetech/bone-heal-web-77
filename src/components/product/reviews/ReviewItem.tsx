
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp } from "lucide-react";
import StarRating from "./StarRating";
import { ReviewItemProps } from "./types";

const ReviewItem = ({ review }: ReviewItemProps) => {
  // Formatar data em formato brasileiro
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="border rounded-lg p-4 hover:border-gray-400 transition-colors">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 border">
          <AvatarFallback className="bg-primary/10 text-primary">
            {review.user_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-medium">{review.user_name || "Usuário"}</span>
              <div className="flex items-center mt-0.5">
                <StarRating rating={review.rating} />
                <span className="ml-2 text-sm text-gray-500">
                  {formatDate(review.created_at)}
                </span>
              </div>
            </div>
            
            <button 
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
              aria-label="Marcar como útil"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>Útil</span>
            </button>
          </div>

          <p className="mt-3 text-gray-700">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
