
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

  // Ordena as avaliações: primeiro por marca (Bone Heal depois Heal Bone), depois por classificação
  const sortedReviews = [...reviews].sort((a, b) => {
    // Primeiro ordenar por classificação (rating) em ordem decrescente
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    // Em caso de empate na classificação, ordena por data (mais recente primeiro)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (sortedReviews.length === 0) {
    return (
      <div className="bg-gray-50 border rounded-lg p-8 text-center">
        <p className="text-gray-500">
          Seja o primeiro a avaliar este produto!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-5 mb-4">
        <h3 className="font-medium text-lg mb-1">Resumo das Avaliações</h3>
        <div className="flex items-center">
          <div className="text-3xl font-bold text-primary mr-3">
            {(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0).toFixed(1)}
            <span className="text-lg">/5</span>
          </div>
          <div className="text-sm text-gray-500">
            Baseado em {reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}
          </div>
        </div>
      </div>
      
      {sortedReviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewsList;
