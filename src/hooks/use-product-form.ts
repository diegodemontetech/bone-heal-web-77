
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema, ProductFormValues } from "@/validators/product-schema";
import { checkExistingProduct, createProduct, updateProduct } from "@/api/product-api";
import { useProductImages } from "@/hooks/use-product-images";
import { useProductNotifications } from "@/utils/product-notifications";
import { Product } from "@/types/product";

export type { ProductFormValues };

export const useProductForm = (
  product?: Product,
  onSuccess?: () => void,
  onClose?: () => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { images, setImages } = useProductImages(
    product?.gallery ? [product.main_image, ...product.gallery].filter(Boolean) as string[] : []
  );
  const { notifyProductCreated, notifyProductUpdated, notifyProductError } = useProductNotifications();
  const [technicalDetails, setTechnicalDetails] = useState<Record<string, any>>(
    product?.technical_details || {}
  );

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      omie_code: product?.omie_code || "",
      weight: product?.weight || 0.2,
      short_description: product?.short_description || "",
      description: product?.description || "",
      video_url: product?.video_url || "",
      on_order: product?.on_order || false,
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    setIsLoading(true);
    try {
      // Verificar se já existe um produto com o mesmo código Omie
      const { data: existingProduct, error: checkError } = await checkExistingProduct(
        values.omie_code, 
        product?.id
      );

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = não encontrou nenhum registro
        throw checkError;
      }

      if (existingProduct) {
        throw new Error("Já existe um produto cadastrado com este código Omie");
      }

      console.log("Imagens a serem salvas:", images);

      // Preparar dados para salvar no banco
      const data = {
        name: values.name,
        slug: values.slug,
        omie_code: values.omie_code,
        weight: Number(values.weight), // Garantir que seja número
        short_description: values.short_description,
        description: values.description,
        video_url: values.video_url,
        main_image: images[0] || null,
        gallery: images.slice(1),
        technical_details: technicalDetails,
        on_order: values.on_order,
        active: true,
      };

      console.log("Dados do produto a serem salvos:", data);

      if (product) {
        const { error } = await updateProduct(product.id, data);
        if (error) throw error;
        notifyProductUpdated();
      } else {
        const { error } = await createProduct(data);
        if (error) throw error;
        notifyProductCreated();
      }

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Erro ao salvar produto:", error);
      notifyProductError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    images,
    setImages,
    technicalDetails,
    setTechnicalDetails,
    onSubmit,
    handleSubmit: form.handleSubmit(onSubmit)
  };
};
