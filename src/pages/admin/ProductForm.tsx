
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductForm } from "@/hooks/use-product-form";
import ProductBasicDetails from "@/components/admin/products/ProductBasicDetails";
import ProductDescriptionDetails from "@/components/admin/products/ProductDescriptionDetails";
import ProductImageUpload from "@/components/admin/ProductImageUpload";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FormLabel, FormItem } from "@/components/ui/form";

const AdminProductForm = () => {
  const navigate = useNavigate();
  const { form, isLoading, images, setImages, handleSubmit } = useProductForm(
    undefined,
    () => {
      navigate("/admin/products");
    },
    () => {}
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Adicionar Novo Produto</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ProductBasicDetails form={form} />
            <ProductDescriptionDetails form={form} />

            <FormItem>
              <FormLabel>Imagens do Produto</FormLabel>
              <ProductImageUpload
                images={images}
                onChange={setImages}
                maxImages={3}
              />
            </FormItem>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/admin/products")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Criar Produto
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AdminProductForm;
