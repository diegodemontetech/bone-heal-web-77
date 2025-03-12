
import { toast } from "sonner";

export const useOrderValidation = () => {
  const validateOrderData = (selectedCustomer: any, selectedProducts: any[]) => {
    console.log("Validando dados do pedido...");

    if (!selectedCustomer?.id) {
      throw new Error("Cliente não selecionado");
    }

    if (selectedProducts.length === 0) {
      throw new Error("Adicione pelo menos um produto");
    }

    // Verificação mais básica para permitir pedidos mesmo sem códigos Omie
    const invalidProducts = selectedProducts.filter(p => !p.price || p.price <= 0);
    if (invalidProducts.length > 0) {
      throw new Error(`Os seguintes produtos têm preços inválidos: ${invalidProducts.map(p => p.name).join(", ")}`);
    }

    return true;
  };

  return { validateOrderData };
};
