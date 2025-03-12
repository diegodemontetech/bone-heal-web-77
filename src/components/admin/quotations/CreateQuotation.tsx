
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import CustomerSelection from "./components/CustomerSelection";
import QuotationSummary from "./components/QuotationSummary";
import ProductSelectionCard from "./components/ProductSelectionCard";
import { useQuotationForm } from "./hooks/useQuotationForm";
import { useProductsQuery } from "./hooks/useProductsQuery";

interface CreateQuotationProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateQuotation = ({ onCancel, onSuccess }: CreateQuotationProps) => {
  const {
    selectedCustomer,
    setSelectedCustomer,
    selectedProducts,
    paymentMethod,
    setPaymentMethod,
    discount,
    setDiscount,
    discountType,
    setDiscountType,
    loading,
    handleProductQuantityChange,
    handleCreateQuotation,
    appliedVoucher,
    setAppliedVoucher,
    zipCode,
    setZipCode,
    selectedShipping,
    setSelectedShipping,
  } = useQuotationForm({ onCancel, onSuccess });

  // Buscar produtos usando o hook personalizado
  const { data: products = [], isLoading: isLoadingProducts } = useProductsQuery();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seleção de Cliente */}
        <CustomerSelection 
          selectedCustomer={selectedCustomer} 
          setSelectedCustomer={setSelectedCustomer} 
        />

        {/* Resumo do Orçamento */}
        <QuotationSummary
          selectedCustomer={selectedCustomer}
          selectedProducts={selectedProducts}
          loading={loading}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          discount={discount}
          setDiscount={setDiscount}
          discountType={discountType}
          setDiscountType={setDiscountType}
          onCreateQuotation={handleCreateQuotation}
          onCancel={onCancel}
          appliedVoucher={appliedVoucher}
          setAppliedVoucher={setAppliedVoucher}
          zipCode={zipCode}
          setZipCode={setZipCode}
          selectedShipping={selectedShipping}
          setSelectedShipping={setSelectedShipping}
        />
      </div>
      
      {/* Produtos */}
      <ProductSelectionCard
        products={products}
        selectedProducts={selectedProducts}
        isLoading={isLoadingProducts}
        onProductQuantityChange={handleProductQuantityChange}
      />
    </div>
  );
};

export default CreateQuotation;
