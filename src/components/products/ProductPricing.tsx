
import React from "react";
import { formatCurrency, formatInstallment } from "@/utils/price-formatters";

interface ProductPricingProps {
  price: number;
}

export const ProductPricing: React.FC<ProductPricingProps> = ({ price }) => {
  const formattedInstallment = formatInstallment(price, 6);
  const formattedPrice = formatCurrency(price);

  return (
    <div className="mt-3 mb-4">
      <div className="font-bold text-2xl md:text-3xl text-gray-900">
        {formattedPrice}
      </div>
      <div className="text-sm text-green-600 font-medium mt-1">
        ou 6x de {formattedInstallment} sem juros
      </div>
    </div>
  );
};
