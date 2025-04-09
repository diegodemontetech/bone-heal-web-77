
import { Product } from "@/types/product";

export interface ProductReviewsProps {
  productId?: string;
  product?: Product;
}

export interface ReviewFormProps {
  userRating: number;
  setUserRating: (rating: number) => void;
  userReview: string;
  setUserReview: (review: string) => void;
  submitReview: () => void;
  submitLoading: boolean;
}

export interface QuestionFormProps {
  question: string;
  setQuestion: (question: string) => void;
  submitQuestion: () => void;
}

export interface StarRatingProps {
  rating: number;
  setRating?: (value: number) => void;
}

export interface ReviewItemProps {
  review: {
    id: string;
    user_name: string;
    created_at: string;
    rating: number;
    comment: string;
    helpful_count?: number;
  };
}
