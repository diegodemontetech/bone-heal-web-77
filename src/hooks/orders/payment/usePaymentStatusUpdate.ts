
import { useOrderSync } from "./useOrderSync";
import { useCustomerSync } from "./useCustomerSync";
import { usePaymentUpdater } from "./usePaymentUpdater";

/**
 * Hook for managing payment status updates in orders
 */
export const usePaymentStatusUpdate = () => {
  const { syncPaidOrderWithOmie } = useOrderSync();
  const { syncCustomerWithOmie } = useCustomerSync();
  const { updateOrderPaymentStatus } = usePaymentUpdater();

  return {
    updateOrderPaymentStatus,
    syncPaidOrderWithOmie,
    syncCustomerWithOmie,
  };
};
