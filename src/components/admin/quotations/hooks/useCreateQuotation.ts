
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ShippingCalculationRate } from "@/types/shipping";

export const useCreateQuotation = (onCancel: () => void) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createQuotation = async (
    selectedCustomer: any,
    selectedProducts: any[],
    paymentMethod: string,
    discountType: string,
    subtotal: number,
    discountAmount: number,
    total: number,
    appliedVoucher: any = null,
    shippingInfo: ShippingCalculationRate | null = null
  ) => {
    if (!selectedCustomer) {
      toast.error("Selecione um cliente");
      return;
    }

    if (!selectedProducts.length) {
      toast.error("Selecione pelo menos um produto");
      return;
    }

    setLoading(true);

    try {
      const quotationItems = selectedProducts.map(product => ({
        product_id: product.id,
        product_name: product.name,
        quantity: product.quantity,
        unit_price: product.price,
        total_price: product.price * product.quantity,
        product_image: product.main_image || product.default_image_url
      }));

      const customerInfo = {
        id: selectedCustomer.id,
        name: selectedCustomer.full_name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone,
        address: selectedCustomer.address,
        city: selectedCustomer.city,
        state: selectedCustomer.state,
        zip_code: selectedCustomer.zip_code
      };

      const quotationData = {
        user_id: selectedCustomer.id,
        items: quotationItems,
        payment_method: paymentMethod,
        discount_type: discountType,
        discount_amount: discountAmount,
        subtotal_amount: subtotal,
        total_amount: total,
        customer_info: customerInfo,
        status: "draft",
        shipping_info: shippingInfo ? {
          cost: shippingInfo.rate,
          service: shippingInfo.service_type,
          estimated_days: shippingInfo.delivery_days,
          zip_code: selectedCustomer.zip_code || shippingInfo.zipCode
        } : null
      };

      const { data, error } = await supabase
        .from("quotations")
        .insert([quotationData])
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar orçamento:", error);
        throw new Error(error.message);
      }

      toast.success("Orçamento criado com sucesso!");
      navigate("/admin/quotations");
    } catch (error: any) {
      console.error("Erro:", error);
      toast.error(`Erro ao criar orçamento: ${error.message || "Erro desconhecido"}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createQuotation
  };
};
