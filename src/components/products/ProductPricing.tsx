
import React from "react";
import { useInstallments } from "@/hooks/use-installments";
import { formatCurrency, formatInstallment } from "@/utils/price-formatters";

interface ProductPricingProps {
  price: number;
}

export const ProductPricing: React.FC<ProductPricingProps> = ({ price }) => {
  const { installments } = useInstallments(price || 0, 12);
  const installmentValue = installments.length > 0 ? installments[installments.length - 1].value : 0;
  const formattedInstallment = formatInstallment(price, 12);
  const formattedPrice = formatCurrency(price);

  return (
    <div className="mt-2">
      <div className="font-semibold text-md md:text-lg">
        {formattedPrice}
      </div>
      <div className="text-xs text-green-600">
        ou 12x de {formattedInstallment} sem juros
      </div>
    </div>
  );
};
