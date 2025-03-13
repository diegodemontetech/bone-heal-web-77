
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ProductImageUpload from "./ProductImageUpload";
import ProductBasicDetails from "./products/ProductBasicDetails";
import ProductDescriptionDetails from "./products/ProductDescriptionDetails";
import ProductTechnicalDetails from "./products/ProductTechnicalDetails";
import { useProductForm } from "@/hooks/use-product-form";
import { FormLabel, FormItem } from "@/components/ui/form";

interface ProductFormProps {
  product?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductForm = ({ product, onClose, onSuccess }: ProductFormProps) => {
  const { 
    form, 
    isLoading, 
    images, 
    setImages, 
    technicalDetails,
    setTechnicalDetails,
    handleSubmit 
  } = useProductForm(
    product,
    onSuccess,
    onClose
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do produto abaixo
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ProductBasicDetails form={form} />
            <ProductDescriptionDetails form={form} />
            <ProductTechnicalDetails 
              omieCode={form.getValues("omie_code")} 
              productName={form.getValues("name")} 
              technicalDetails={technicalDetails}
              onChange={setTechnicalDetails}
            />

            <FormItem>
              <FormLabel>Imagens do Produto</FormLabel>
              <ProductImageUpload
                images={images}
                onChange={setImages}
                maxImages={3}
              />
            </FormItem>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {product ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
