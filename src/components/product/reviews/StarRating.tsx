
import { StarIcon } from "lucide-react";
import { StarRatingProps } from "./types";

const StarRating = ({ rating, setRating }: StarRatingProps) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button 
          key={star}
          type="button"
          onClick={() => setRating && setRating(star)}
          className={`${setRating ? 'cursor-pointer' : 'cursor-default'}`}
          disabled={!setRating}
        >
          <StarIcon 
            className={`h-5 w-5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
