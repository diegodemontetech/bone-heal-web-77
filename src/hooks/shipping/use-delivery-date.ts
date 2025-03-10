
import { addDays } from "date-fns";
import { ShippingRate } from "@/types/shipping";

export const useDeliveryDate = (selectedShippingRate: ShippingRate | null) => {
  // Calcular a data estimada de entrega com base no prazo do frete selecionado
  const deliveryDate = selectedShippingRate 
    ? addDays(new Date(), selectedShippingRate.delivery_days) 
    : null;

  return { deliveryDate };
};
