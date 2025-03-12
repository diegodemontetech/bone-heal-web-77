
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  [key: string]: any; // Para outras propriedades que os produtos possam ter
}

interface UseSelectedProductsReturn {
  selectedProducts: Product[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  handleProductQuantityChange: (product: Product, quantity: number) => void;
  getTotalItems: () => number;
  clearSelectedProducts: () => void;
  isProductSelected: (productId: string) => boolean;
  getSelectedProductQuantity: (productId: string) => number;
}

/**
 * Hook para gerenciar os produtos selecionados em um orçamento ou pedido
 */
export const useSelectedProducts = (): UseSelectedProductsReturn => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  /**
   * Atualiza a quantidade de um produto ou adiciona/remove da lista
   */
  const handleProductQuantityChange = (product: Product, quantity: number) => {
    if (quantity > 0) {
      setSelectedProducts((prev) => {
        const existing = prev.find((p) => p.id === product.id);
        if (existing) {
          return prev.map((p) =>
            p.id === product.id ? { ...p, quantity } : p
          );
        }
        return [...prev, { ...product, quantity }];
      });
    } else {
      setSelectedProducts((prev) =>
        prev.filter((p) => p.id !== product.id)
      );
    }
  };

  /**
   * Retorna o total de itens selecionados
   */
  const getTotalItems = () => {
    return selectedProducts.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * Limpa a lista de produtos selecionados
   */
  const clearSelectedProducts = () => {
    setSelectedProducts([]);
  };

  /**
   * Verifica se um produto está selecionado
   */
  const isProductSelected = (productId: string) => {
    return selectedProducts.some(product => product.id === productId);
  };

  /**
   * Retorna a quantidade selecionada de um produto específico
   */
  const getSelectedProductQuantity = (productId: string) => {
    const product = selectedProducts.find(p => p.id === productId);
    return product ? product.quantity : 0;
  };

  return {
    selectedProducts,
    setSelectedProducts,
    handleProductQuantityChange,
    getTotalItems,
    clearSelectedProducts,
    isProductSelected,
    getSelectedProductQuantity
  };
};
