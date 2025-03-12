
import { Truck } from "lucide-react";

interface OrderShippingProps {
  shippingAddress?: {
    zip_code?: string;
  };
  shippingFee?: number;
}

const OrderShippingSection = ({ shippingAddress, shippingFee }: OrderShippingProps) => {
  return (
    <div className="flex items-start gap-4">
      <Truck className="h-5 w-5 text-gray-500 mt-0.5" />
      <div>
        <h3 className="font-medium">Envio</h3>
        <p className="text-sm text-gray-600">
          Endereço: CEP {shippingAddress?.zip_code || "Não informado"}
        </p>
        <p className="text-sm text-gray-600">
          Frete: R$ {shippingFee?.toFixed(2) || "0.00"}
        </p>
      </div>
    </div>
  );
};

export default OrderShippingSection;
