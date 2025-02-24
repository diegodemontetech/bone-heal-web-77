
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import ProductImageUpload from "./ProductImageUpload";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  omie_code: z.string().min(1, "Código Omie é obrigatório"),
  omie_product_id: z.string().min(1, "ID do produto no Omie é obrigatório"),
  price: z.string().min(1, "Preço é obrigatório").transform(val => parseFloat(val)),
  stock: z.string().transform(val => parseInt(val || "0")),
  short_description: z.string().optional(),
  description: z.string().optional(),
});

interface ProductFormProps {
  product?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductForm = ({ product, onClose, onSuccess }: ProductFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>(
    product?.gallery ? [product.main_image, ...product.gallery] : []
  );
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      omie_code: product?.omie_code || "",
      omie_product_id: product?.omie_product_id || "",
      price: product?.price?.toString() || "",
      stock: product?.stock?.toString() || "0",
      short_description: product?.short_description || "",
      description: product?.description || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Verificar se já existe um produto com o mesmo código Omie
      const { data: existingProduct, error: checkError } = await supabase
        .from("products")
        .select("id")
        .or(`omie_code.eq.${values.omie_code},omie_product_id.eq.${values.omie_product_id}`)
        .neq('id', product?.id || '')
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = não encontrou nenhum registro
        throw checkError;
      }

      if (existingProduct) {
        throw new Error("Já existe um produto cadastrado com este código Omie ou ID de produto");
      }

      const data = {
        name: values.name,
        slug: values.slug,
        omie_code: values.omie_code,
        omie_product_id: values.omie_product_id,
        price: values.price,
        stock: values.stock,
        short_description: values.short_description,
        description: values.description,
        main_image: images[0] || null,
        gallery: images.slice(1),
        active: true,
      };

      if (product) {
        const { error } = await supabase
          .from("products")
          .update(data)
          .eq("id", product.id);

        if (error) throw error;

        toast({
          title: "Produto atualizado com sucesso!",
          description: "O produto foi atualizado e está sincronizado com o Omie."
        });
      } else {
        const { error } = await supabase
          .from("products")
          .insert([data]);

        if (error) throw error;

        toast({
          title: "Produto criado com sucesso!",
          description: "O produto foi cadastrado e está sincronizado com o Omie."
        });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar produto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="omie_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Omie</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Código do produto no Omie
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="omie_product_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Produto Omie</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      ID interno do produto no Omie
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Curta</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Completa</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
