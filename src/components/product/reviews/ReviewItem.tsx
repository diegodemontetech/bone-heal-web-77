
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp } from "lucide-react";
import StarRating from "./StarRating";
import { ReviewItemProps } from "./types";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const ReviewItem = ({ review }: ReviewItemProps) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0);
  const [userMarkedHelpful, setUserMarkedHelpful] = useState(false);
  
  // Formatar data em formato brasileiro
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const handleMarkHelpful = () => {
    if (!userMarkedHelpful) {
      setHelpfulCount(helpfulCount + 1);
      setUserMarkedHelpful(true);
    }
  };

  // Gerar badges de verificação
  const generateBadges = () => {
    const badges = [];
    
    if (review.verified_purchase) {
      badges.push(
        <Badge key="verified" variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Compra Verificada
        </Badge>
      );
    }
    
    return badges;
  };

  return (
    <div className="border rounded-lg p-5 hover:border-gray-400 transition-colors">
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
              
              <div className="flex gap-2 mt-1">
                {generateBadges()}
              </div>
            </div>
            
            <button 
              className={`flex items-center gap-1 text-xs ${userMarkedHelpful ? 'text-primary font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={handleMarkHelpful}
              disabled={userMarkedHelpful}
              aria-label="Marcar como útil"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>{userMarkedHelpful ? 'Útil' : 'Marcar como útil'}</span>
              {helpfulCount > 0 && <span className="ml-1">({helpfulCount})</span>}
            </button>
          </div>

          <p className="mt-3 text-gray-700">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
