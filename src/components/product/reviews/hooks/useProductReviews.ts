
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const useProductReviews = (productId: string) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchReviews = async () => {
    if (!productId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const reviewsWithUserNames = await Promise.all(
        data.map(async (review) => {
          const { data: userData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', review.user_id)
            .single();
          
          return {
            ...review,
            user_name: userData?.full_name || 'Usuário'
          };
        })
      );
      
      setReviews(reviewsWithUserNames);
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (review: string, rating: number, onSuccess?: () => void) => {
    if (!session || !productId) return;

    setSubmitLoading(true);
    try {
      const { error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          user_id: session.user.id,
          rating: rating,
          comment: review
        });

      if (error) throw error;

      toast({
        title: "Avaliação enviada",
        description: "Obrigado pela sua avaliação!"
      });

      if (onSuccess) onSuccess();
      fetchReviews();
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua avaliação",
        variant: "destructive"
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return {
    reviews,
    loading,
    submitReview,
    submitLoading,
    refreshReviews: fetchReviews
  };
};

export default useProductReviews;
