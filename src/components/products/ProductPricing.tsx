
import React from "react";
import { formatCurrency, formatInstallment } from "@/utils/price-formatters";

interface ProductPricingProps {
  price: number;
}

export const ProductPricing: React.FC<ProductPricingProps> = ({ price }) => {
  const formattedInstallment = formatInstallment(price, 6);
  const formattedPrice = formatCurrency(price);

  return (
    <div className="mt-2">
      <div className="font-semibold text-md md:text-lg">
        {formattedPrice}
      </div>
      <div className="text-xs text-green-600">
        ou 6x de {formattedInstallment} sem juros
      </div>
    </div>
  );
};
