
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
    <div className="border rounded-lg p-4 bg-gray-50 space-y-3 mt-4">
      <h4 className="text-md font-medium">Adicionar Avaliação</h4>
      <div className="flex items-center mb-2">
        <span className="mr-2">Sua avaliação:</span>
        <StarRating rating={userRating} setRating={setUserRating} />
      </div>
      <Textarea 
        placeholder="Escreva sua avaliação aqui..."
        value={userReview}
        onChange={(e) => setUserReview(e.target.value)}
        className="bg-white"
      />
      <Button 
        onClick={submitReview}
        disabled={submitLoading}
        className="bg-primary hover:bg-primary/90 text-white"
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
