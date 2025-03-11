
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCreateQuotation = (onCancel: () => void) => {
  const [loading, setLoading] = useState(false);

  const createQuotation = async (
    selectedCustomer: any,
    selectedProducts: any[],
    paymentMethod: string,
    discountType: string,
    subtotal: number,
    discountAmount: number,
    total: number,
    appliedVoucher: any = null
  ) => {
    if (!selectedCustomer) {
      toast.error("Por favor, selecione um cliente");
      return;
    }

    if (!selectedProducts.length) {
      toast.error("Por favor, adicione pelo menos um produto");
      return;
    }

    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        toast.error("Você precisa estar autenticado para criar um orçamento");
        return;
      }

      // Preparar itens do orçamento
      const items = selectedProducts.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      }));

      // Preparar informações do cliente
      const customerInfo = {
        id: selectedCustomer.id,
        name: selectedCustomer.nome_cliente || selectedCustomer.full_name,
        email: selectedCustomer.email,
        phone: selectedCustomer.telefone || selectedCustomer.phone,
        address: selectedCustomer.endereco || selectedCustomer.address,
        city: selectedCustomer.cidade || selectedCustomer.city,
        state: selectedCustomer.estado || selectedCustomer.state,
        document: selectedCustomer.cnpj_cpf || selectedCustomer.cnpj || selectedCustomer.cpf
      };

      // Dados do orçamento
      const quotationData = {
        user_id: user.id,
        customer_info: customerInfo,
        items: items,
        payment_method: paymentMethod,
        discount_type: discountType,
        discount_amount: discountAmount,
        subtotal_amount: subtotal,
        total_amount: total,
        status: 'draft',
        voucher_id: appliedVoucher?.id || null,
      };

      const { data, error } = await supabase
        .from('quotations')
        .insert([quotationData])
        .select('id')
        .single();

      if (error) throw error;

      // Se aplicou um cupom, incrementar o contador de uso
      if (appliedVoucher) {
        await supabase
          .from('vouchers')
          .update({
            current_uses: appliedVoucher.current_uses + 1
          })
          .eq('id', appliedVoucher.id);
      }

      toast.success("Orçamento criado com sucesso!");
      onCancel();
    } catch (error) {
      console.error("Erro ao criar orçamento:", error);
      toast.error("Erro ao criar orçamento. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createQuotation
  };
};
