
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";
import useProductReviews from "./hooks/useProductReviews";

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

  return (
    <>
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
    </>
  );
};

export default ReviewsTab;
