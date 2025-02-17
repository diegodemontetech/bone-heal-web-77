
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductReviewsProps {
  product: Product;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
  } | null;
}

const ProductReviews = ({ product }: ProductReviewsProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: reviews, refetch } = useQuery({
    queryKey: ["reviews", product.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_reviews")
        .select(`
          *,
          profiles:profiles(full_name)
        `)
        .eq("product_id", product.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
  });

  const handleSubmitReview = async () => {
    if (!session) {
      toast({
        title: "Login necessário",
        description: "Faça login para avaliar o produto",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("product_reviews").insert({
        product_id: product.id,
        user_id: session.user.id,
        rating,
        comment,
      });

      if (error) throw error;

      toast({
        title: "Avaliação enviada",
        description: "Obrigado por avaliar este produto!",
      });

      setComment("");
      setRating(5);
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro ao enviar avaliação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, index) => (
          index < rating ? (
            <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ) : (
            <StarOff key={index} className="w-4 h-4 text-gray-300" />
          )
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {session && (
        <Card>
          <CardHeader>
            <CardTitle>Avaliar Produto</CardTitle>
            <CardDescription>Compartilhe sua experiência com este produto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Sua avaliação:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => setRating(value)}
                      className="focus:outline-none"
                    >
                      {value <= rating ? (
                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="w-6 h-6 text-gray-300" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Compartilhe sua opinião sobre o produto..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
              </div>
              <Button 
                onClick={handleSubmitReview} 
                disabled={isSubmitting || !comment.trim()}
              >
                Enviar Avaliação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Avaliações dos Clientes ({reviews?.length || 0})
        </h3>
        {reviews?.length === 0 ? (
          <p className="text-muted-foreground">
            Este produto ainda não possui avaliações.
          </p>
        ) : (
          <div className="space-y-4">
            {reviews?.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        {review.profiles?.full_name || "Usuário"}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
