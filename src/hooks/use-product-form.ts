
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  omie_code: z.string().min(1, "Código Omie é obrigatório"),
  weight: z.string().transform(val => parseFloat(val || "0")),
  short_description: z.string().optional(),
  description: z.string().optional(),
  video_url: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof formSchema>;

export const useProductForm = (
  product?: any,
  onSuccess?: () => void,
  onClose?: () => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>(
    product?.gallery ? [product.main_image, ...product.gallery] : []
  );
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      omie_code: product?.omie_code || "",
      weight: product?.weight?.toString() || "0.5",
      short_description: product?.short_description || "",
      description: product?.description || "",
      video_url: product?.video_url || "",
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    setIsLoading(true);
    try {
      // Verificar se já existe um produto com o mesmo código Omie
      const { data: existingProduct, error: checkError } = await supabase
        .from("products")
        .select("id")
        .eq('omie_code', values.omie_code)
        .neq('id', product?.id || '')
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = não encontrou nenhum registro
        throw checkError;
      }

      if (existingProduct) {
        throw new Error("Já existe um produto cadastrado com este código Omie");
      }

      const data = {
        name: values.name,
        slug: values.slug,
        omie_code: values.omie_code,
        weight: values.weight,
        short_description: values.short_description,
        description: values.description,
        video_url: values.video_url,
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

      if (onSuccess) onSuccess();
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

  return {
    form,
    isLoading,
    images,
    setImages,
    onSubmit,
    handleSubmit: form.handleSubmit(onSubmit)
  };
};
