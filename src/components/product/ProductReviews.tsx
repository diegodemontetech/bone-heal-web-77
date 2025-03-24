import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon } from "lucide-react";
import { Product } from "@/types/product";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductReviewsProps {
  productId?: string;
  product?: Product;
}

const ProductReviews = ({ productId, product }: ProductReviewsProps) => {
  const actualProductId = productId || (product ? product.id : "");
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [activeTab, setActiveTab] = useState("reviews");
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (actualProductId) {
      fetchReviews();
    }
  }, [actualProductId]);

  const fetchReviews = async () => {
    if (!actualProductId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', actualProductId)
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

  const submitReview = async () => {
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

    if (!actualProductId) {
      toast({
        title: "Erro",
        description: "ID do produto não encontrado",
        variant: "destructive"
      });
      return;
    }

    setSubmitLoading(true);
    try {
      const { error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: actualProductId,
          user_id: session.user.id,
          rating: userRating,
          comment: userReview
        });

      if (error) throw error;

      toast({
        title: "Avaliação enviada",
        description: "Obrigado pela sua avaliação!"
      });

      setUserReview("");
      setUserRating(5);
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

  const submitQuestion = async () => {
    if (!session) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para enviar uma pergunta",
        variant: "destructive"
      });
      return;
    }

    if (!question.trim()) {
      toast({
        title: "Pergunta vazia",
        description: "Por favor, escreva sua pergunta",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Pergunta enviada",
      description: "Obrigado por sua pergunta! Nossa equipe responderá em breve."
    });

    setQuestion("");
  };

  const StarRating = ({ rating, setRating }: { rating: number, setRating?: (value: number) => void }) => {
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

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          <TabsTrigger value="questions">Perguntas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reviews" className="mt-6">
          <h3 className="text-xl font-semibold">Avaliações</h3>
          
          {session && (
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
          )}
          
          <div className="space-y-4 mt-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{review.user_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{review.user_name}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <StarRating rating={review.rating} />
                      <p className="mt-2 text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-gray-500">
                Sem avaliações ainda. Seja o primeiro a avaliar este produto!
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="questions" className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Perguntas sobre o produto</h3>
          
          <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
            <h4 className="text-md font-medium">Tire dúvidas sobre o produto</h4>
            <Textarea 
              placeholder="Escreva sua pergunta aqui..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="bg-white"
            />
            <Button 
              onClick={submitQuestion}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Fazer uma pergunta
            </Button>
          </div>
          
          <div className="space-y-4 mt-6">
            <p className="text-center py-6 text-gray-500">
              Este produto ainda não tem perguntas. Faça a primeira!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductReviews;
