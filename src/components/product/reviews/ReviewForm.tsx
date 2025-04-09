
import { useSession } from "@supabase/auth-helpers-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "./StarRating";
import { ReviewFormProps } from "./types";

const ReviewForm = ({ 
  userRating, 
  setUserRating, 
  userReview, 
  setUserReview, 
  submitReview, 
  submitLoading 
}: ReviewFormProps) => {
  const session = useSession();

  if (!session) return null;

  return (
    <div className="border rounded-lg p-5 bg-gray-50 space-y-4">
      <h4 className="font-medium">Escreva uma Avaliação</h4>
      
      <div>
        <p className="mb-1 text-sm text-gray-700">Sua avaliação</p>
        <div className="flex items-center">
          <StarRating rating={userRating} setRating={setUserRating} />
          <span className="ml-2 text-sm text-gray-500">
            {userRating === 5 ? "Excelente" : 
             userRating === 4 ? "Muito bom" :
             userRating === 3 ? "Bom" :
             userRating === 2 ? "Regular" : "Ruim"}
          </span>
        </div>
      </div>
      
      <div>
        <p className="mb-1 text-sm text-gray-700">Seu comentário</p>
        <Textarea 
          placeholder="Conte sua experiência com este produto..."
          value={userReview}
          onChange={(e) => setUserReview(e.target.value)}
          className="bg-white resize-y"
          rows={4}
        />
        <p className="mt-1 text-xs text-gray-500">
          {400 - userReview.length} caracteres restantes
        </p>
      </div>
      
      <Button 
        onClick={submitReview}
        disabled={submitLoading || !userReview.trim()}
        className="w-full sm:w-auto"
      >
        {submitLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : "Enviar Avaliação"}
      </Button>
    </div>
  );
};

export default ReviewForm;
