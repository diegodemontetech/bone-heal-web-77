
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CustomerSelection } from "./order/CustomerSelection";
import { ProductSelection } from "./order/ProductSelection";
import { OrderSummary } from "./order/OrderSummary";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { useOrderCustomers } from "@/hooks/useOrderCustomers";
import { useOrderProducts } from "@/hooks/useOrderProducts";
import { ShippingSection } from "./order/ShippingSection";
import { PaymentMethodSection } from "./order/PaymentMethodSection";

interface CreateOrderProps {
  onCancel: () => void;
}

const CreateOrder = ({ onCancel }: CreateOrderProps) => {
  const {
    loading,
    createOrder,
    calculateTotal,
    paymentMethod,
    setPaymentMethod,
    shippingFee,
    setShippingFee,
    selectedShipping,
    setSelectedShipping
  } = useCreateOrder();

  const {
    customers,
    isLoadingCustomers,
    selectedCustomer,
    setSelectedCustomer,
    customerSearchTerm,
    setCustomerSearchTerm,
    customerDialogOpen,
    setCustomerDialogOpen,
    handleRegistrationSuccess
  } = useOrderCustomers();

  const {
    products,
    isLoadingProducts,
    searchTerm,
    setSearchTerm,
    selectedProducts,
    handleProductQuantityChange
  } = useOrderProducts();

  const [zipCode, setZipCode] = useState("");

  const handleCreateOrder = () => {
    createOrder(selectedCustomer, selectedProducts, selectedShipping);
  };

  return (
    <div className="container max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seleção de Cliente */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cliente</h3>
            <CustomerSelection
              customers={customers}
              isLoadingCustomers={isLoadingCustomers}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              customerSearchTerm={customerSearchTerm}
              setCustomerSearchTerm={setCustomerSearchTerm}
              customerDialogOpen={customerDialogOpen}
              setCustomerDialogOpen={setCustomerDialogOpen}
              handleRegistrationSuccess={handleRegistrationSuccess}
            />

            {/* Frete - Adicionado */}
            {selectedCustomer && (
              <div className="mt-6">
                <ShippingSection 
                  zipCode={zipCode || selectedCustomer?.zip_code || ""}
                  setZipCode={setZipCode}
                  selectedShipping={selectedShipping}
                  setSelectedShipping={setSelectedShipping}
                />
              </div>
            )}

            {/* Forma de Pagamento - Adicionado */}
            <div className="mt-6">
              <PaymentMethodSection 
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </div>
          </CardContent>
        </Card>

        {/* Produtos */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 space-y-6">
            <ProductSelection
              products={products}
              isLoadingProducts={isLoadingProducts}
              selectedProducts={selectedProducts}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onProductQuantityChange={handleProductQuantityChange}
            />
          </CardContent>
        </Card>

        {/* Resumo */}
        <Card className="lg:col-span-1">
          <OrderSummary
            subtotal={calculateTotal(selectedProducts)}
            shippingFee={selectedShipping?.rate || 0}
            total={calculateTotal(selectedProducts) + (selectedShipping?.rate || 0)}
            loading={loading}
            onCreateOrder={handleCreateOrder}
            onCancel={onCancel}
            hasProducts={selectedProducts.length > 0}
            paymentMethod={paymentMethod}
          />
        </Card>
      </div>
    </div>
  );
};

export default CreateOrder;
