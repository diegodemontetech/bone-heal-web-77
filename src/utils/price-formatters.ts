
/**
 * Utility functions for price formatting
 */

/**
 * Format a price number into a currency string
 */
export const formatCurrency = (price: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

/**
 * Calculate and format installment prices
 */
export const formatInstallment = (price: number, numberOfInstallments: number): string => {
  const installmentValue = price / numberOfInstallments;
  return formatCurrency(installmentValue);
};
