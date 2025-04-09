
import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ReviewsSummaryProps {
  reviews: any[];
}

const ReviewsSummary = ({ reviews }: ReviewsSummaryProps) => {
  if (!reviews.length) return null;

  // Calcular média de avaliações
  const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const roundedRating = Math.round(avgRating * 10) / 10; // Arredonda para 1 casa decimal

  // Contar avaliações por estrela
  const ratingCounts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  reviews.forEach(review => {
    if (ratingCounts[review.rating] !== undefined) {
      ratingCounts[review.rating]++;
    }
  });

  return (
    <div className="bg-white rounded-lg p-6 border mb-8">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold">{roundedRating.toFixed(1)}</div>
          <div className="flex items-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-5 h-5 ${star <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Baseado em {reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}
          </div>
        </div>

        <div className="w-full max-w-md space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <div className="w-12 text-sm font-medium">{rating} estrelas</div>
              <Progress 
                value={(ratingCounts[rating] / reviews.length) * 100} 
                className="h-2 flex-1"
              />
              <div className="w-10 text-sm text-gray-500 text-right">
                {ratingCounts[rating]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsSummary;
