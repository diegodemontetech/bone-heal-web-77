
import { useState } from "react";
import { useCustomerState } from "@/hooks/useCustomerState";
import { useOrderProducts } from "@/hooks/useOrderProducts";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { OrderSummary } from "./order/OrderSummary";
import { ProductSelection } from "./order/ProductSelection";
import { useAdminAuthorization } from "@/hooks/orders/useAdminAuthorization";
import CreateOrderLayout from "./order/create/CreateOrderLayout";
import CustomerSection from "./order/create/CustomerSection";
import { toast } from "sonner";

interface CreateOrderProps {
  onCancel: () => void;
}

const CreateOrder = ({ onCancel }: CreateOrderProps) => {
  const { isAdmin, verifyAdminPermission } = useAdminAuthorization(onCancel);
  const [zipCode, setZipCode] = useState("");

  // Hook para criar pedido
  const {
    loading,
    createOrder,
    calculateTotal,
    paymentMethod,
    setPaymentMethod,
    voucherCode,
    setVoucherCode,
    appliedVoucher,
    setAppliedVoucher,
    isApplyingVoucher,
    setIsApplyingVoucher,
    calculateDiscount,
    selectedShipping,
    setSelectedShipping
  } = useCreateOrder();

  // Hook para gerenciar clientes
  const {
    customers,
    selectedCustomer,
    setSelectedCustomer,
    isLoadingCustomers,
    searchTerm,
    setSearchTerm
  } = useCustomerState();

  // Hook para gerenciar produtos
  const {
    products,
    isLoadingProducts,
    searchTerm: productSearchTerm,
    setSearchTerm: setProductSearchTerm,
    selectedProducts,
    handleProductQuantityChange
  } = useOrderProducts();

  const handleCreateOrder = async () => {
    if (!await verifyAdminPermission()) {
      return;
    }

    if (!selectedCustomer) {
      toast.error("Selecione um cliente para criar o pedido");
      return;
    }
    
    createOrder(selectedCustomer, selectedProducts, selectedShipping);
  };

  // Cálculos de valores
  const subtotal = calculateTotal(selectedProducts);
  const discount = calculateDiscount(subtotal);
  const shippingCost = selectedShipping?.rate || 0;
  const total = subtotal + shippingCost - discount;

  if (!isAdmin) {
    return null;
  }

  return (
    <CreateOrderLayout
      customerSection={
        <CustomerSection
          customers={customers}
          isLoadingCustomers={isLoadingCustomers}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          zipCode={zipCode}
          setZipCode={setZipCode}
          selectedShipping={selectedShipping}
          setSelectedShipping={setSelectedShipping}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          voucherCode={voucherCode}
          setVoucherCode={setVoucherCode}
          appliedVoucher={appliedVoucher}
          setAppliedVoucher={setAppliedVoucher}
          isApplyingVoucher={isApplyingVoucher}
          setIsApplyingVoucher={setIsApplyingVoucher}
          subtotal={subtotal}
          totalItems={selectedProducts.reduce((acc, p) => acc + p.quantity, 0)}
        />
      }
      productsSection={
        <ProductSelection
          products={products}
          isLoadingProducts={isLoadingProducts}
          selectedProducts={selectedProducts}
          searchTerm={productSearchTerm}
          setSearchTerm={setProductSearchTerm}
          onProductQuantityChange={handleProductQuantityChange}
        />
      }
      summarySection={
        <OrderSummary
          subtotal={subtotal}
          discount={discount}
          shippingFee={shippingCost}
          total={total}
          loading={loading}
          onCreateOrder={handleCreateOrder}
          onCancel={onCancel}
          hasProducts={selectedProducts.length > 0}
          paymentMethod={paymentMethod}
          appliedVoucher={appliedVoucher}
        />
      }
    />
  );
};

export default CreateOrder;
