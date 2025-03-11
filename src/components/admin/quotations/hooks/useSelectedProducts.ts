
import { useState } from "react";

export const useSelectedProducts = () => {
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  const handleProductQuantityChange = (product: any, quantity: number) => {
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

  return {
    selectedProducts,
    setSelectedProducts,
    handleProductQuantityChange,
  };
};
