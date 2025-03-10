
/**
 * Hook para calcular parcelas de pagamento
 */
export function useInstallments(total: number, maxInstallments: number = 12) {
  const calculateInstallments = (total: number) => {
    const installments = [];
    for (let i = 1; i <= maxInstallments; i++) {
      const value = total / i;
      installments.push({
        number: i,
        value,
        total: total
      });
    }
    return installments;
  };

  return {
    installments: calculateInstallments(total),
    calculateInstallments
  };
}
