
import { Product } from "@/types/product";

export const validateProductForOmie = (product: Product) => {
  const requiredFields = ['omie_code', 'omie_product_id', 'price', 'stock'];
  const missingFields = requiredFields.filter(field => !product[field as keyof Product]);

  if (missingFields.length > 0) {
    throw new Error(`Produto com dados incompletos para o Omie. Campos faltantes: ${missingFields.join(", ")}`);
  }

  if (product.price <= 0) {
    throw new Error("O preço do produto deve ser maior que zero");
  }

  if (product.stock < 0) {
    throw new Error("O estoque não pode ser negativo");
  }

  return true;
};
