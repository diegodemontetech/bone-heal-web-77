
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";
import useProductReviews from "./hooks/useProductReviews";
import ReviewsSummary from "./ReviewsSummary";

interface ReviewsTabProps {
  productId: string;
}

const ReviewsTab = ({ productId }: ReviewsTabProps) => {
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(5);
  const session = useSession();
  const { toast } = useToast();
  
  const { 
    reviews, 
    loading, 
    submitReview, 
    submitLoading 
  } = useProductReviews(productId);

  const handleSubmitReview = () => {
    if (!session) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para enviar uma avaliação",
        variant: "destructive"
      });
      return;
    }

    if (!userReview.trim()) {
      toast({
        title: "Avaliação vazia",
        description: "Por favor, escreva sua avaliação",
        variant: "destructive"
      });
      return;
    }

    submitReview(userReview, userRating, () => {
      setUserReview("");
      setUserRating(5);
    });
  };

  const hasReviews = reviews.length > 0;

  return (
    <div className="space-y-6">
      {hasReviews && (
        <ReviewsSummary reviews={reviews} />
      )}

      {hasReviews && (
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium">Avaliações dos Clientes</h4>
        </div>
      )}

      {session && (
        <ReviewForm
          userRating={userRating}
          setUserRating={setUserRating}
          userReview={userReview}
          setUserReview={setUserReview}
          submitReview={handleSubmitReview}
          submitLoading={submitLoading}
        />
      )}
      
      <ReviewsList loading={loading} reviews={reviews} />
      
      {!session && hasReviews && (
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">Compartilhe sua experiência com este produto</p>
          <button 
            onClick={() => {
              window.location.href = "/login?redirect=" + window.location.pathname;
            }}
            className="text-primary font-medium hover:underline"
          >
            Faça login para avaliar
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
