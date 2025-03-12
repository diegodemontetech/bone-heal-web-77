
import { useState } from "react";
import { CustomerSelection } from "../CustomerSelection";
import { ShippingSection } from "../ShippingSection";
import { PaymentMethodSection } from "../PaymentMethodSection";
import VoucherSection from "../../quotations/components/summary/VoucherSection";
import { Customer } from "@/hooks/useCustomerState";
import { ShippingCalculationRate } from "@/types/shipping";

interface CustomerSectionProps {
  customers: Customer[];
  isLoadingCustomers: boolean;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  zipCode: string;
  setZipCode: (zipCode: string) => void;
  selectedShipping: ShippingCalculationRate | null;
  setSelectedShipping: (shipping: ShippingCalculationRate | null) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  voucherCode: string;
  setVoucherCode: (code: string) => void;
  appliedVoucher: any;
  setAppliedVoucher: (voucher: any) => void;
  isApplyingVoucher: boolean;
  setIsApplyingVoucher: (isApplying: boolean) => void;
  subtotal: number;
  totalItems: number;
}

const CustomerSection = ({
  customers,
  isLoadingCustomers,
  selectedCustomer,
  setSelectedCustomer,
  searchTerm,
  setSearchTerm,
  zipCode,
  setZipCode,
  selectedShipping,
  setSelectedShipping,
  paymentMethod,
  setPaymentMethod,
  voucherCode,
  setVoucherCode,
  appliedVoucher,
  setAppliedVoucher,
  isApplyingVoucher,
  setIsApplyingVoucher,
  subtotal,
  totalItems
}: CustomerSectionProps) => {
  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Cliente</h3>
      <CustomerSelection
        customers={customers}
        isLoadingCustomers={isLoadingCustomers}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

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

      <div className="mt-6">
        <PaymentMethodSection 
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      </div>
      
      <div className="mt-6">
        <VoucherSection
          voucherCode={voucherCode}
          setVoucherCode={setVoucherCode}
          appliedVoucher={appliedVoucher}
          setAppliedVoucher={setAppliedVoucher}
          isApplyingVoucher={isApplyingVoucher}
          setIsApplyingVoucher={setIsApplyingVoucher}
          paymentMethod={paymentMethod}
          subtotal={subtotal}
          totalItems={totalItems}
        />
      </div>
    </>
  );
};

export default CustomerSection;
