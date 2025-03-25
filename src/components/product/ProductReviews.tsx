
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/product";
import ReviewsTab from "./reviews/ReviewsTab";
import QuestionsTab from "./reviews/QuestionsTab";
import { ProductReviewsProps } from "./reviews/types";

const ProductReviews = ({ productId, product }: ProductReviewsProps) => {
  const actualProductId = productId || (product ? product.id : "");
  const [activeTab, setActiveTab] = useState("reviews");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          <TabsTrigger value="questions">Perguntas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reviews" className="mt-6">
          <h3 className="text-xl font-semibold">Avaliações</h3>
          {actualProductId ? (
            <ReviewsTab productId={actualProductId} />
          ) : (
            <p className="text-center py-6 text-gray-500">
              ID do produto não encontrado
            </p>
          )}
        </TabsContent>

        <TabsContent value="questions" className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Perguntas sobre o produto</h3>
          <QuestionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductReviews;
