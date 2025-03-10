
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useQuotationForm = ({ onCancel }: { onCancel: () => void }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("percentage");
  const [loading, setLoading] = useState(false);

  const handleProductQuantityChange = (product: any, quantity: number) => {
    if (quantity > 0) {
      setSelectedProducts((prev) => {
        const existing = prev.find((p) => p.id === product.id);
        if (existing) {
          return prev.map((p) =>
            p.id === product.id ? { ...p, quantity } : p
          );
        }
        return [...prev, { ...product, quantity }];
      });
    } else {
      setSelectedProducts((prev) =>
        prev.filter((p) => p.id !== product.id)
      );
    }
  };

  const calculateSubtotal = () => {
    return selectedProducts.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const calculateDiscountAmount = () => {
    const subtotal = calculateSubtotal();
    if (discountType === "percentage") {
      return subtotal * (discount / 100);
    } else {
      return discount;
    }
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    return subtotal - discountAmount;
  };

  const handleCreateQuotation = async () => {
    try {
      setLoading(true);

      // Validações
      if (!selectedCustomer) {
        toast.error("Selecione um cliente para o orçamento");
        return;
      }

      if (selectedProducts.length === 0) {
        toast.error("Adicione pelo menos um produto ao orçamento");
        return;
      }

      const subtotal = calculateSubtotal();
      const discountAmount = calculateDiscountAmount();
      const total = calculateTotal();

      const quoteItems = selectedProducts.map(product => ({
        product_id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        omie_code: product.omie_code || null
      }));

      // Criar orçamento no banco de dados
      const { data: quotation, error } = await supabase
        .from("quotations")
        .insert({
          user_id: selectedCustomer.id,
          items: quoteItems,
          status: "draft",
          discount_type: discountType,
          discount_amount: discountAmount,
          subtotal_amount: subtotal,
          total_amount: total,
          payment_method: paymentMethod,
          customer_info: {
            name: selectedCustomer.full_name,
            email: selectedCustomer.email,
            phone: selectedCustomer.phone,
            address: selectedCustomer.address,
            city: selectedCustomer.city,
            state: selectedCustomer.state,
            zip_code: selectedCustomer.zip_code
          }
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar orçamento:", error);
        throw error;
      }

      toast.success("Orçamento criado com sucesso!");

      // Perguntar se deseja enviar por e-mail
      const sendEmail = window.confirm("Deseja enviar o orçamento por e-mail para o cliente?");
      
      if (sendEmail) {
        try {
          // Chamar a Edge Function para enviar e-mail
          await supabase.functions.invoke("process-email", {
            body: {
              template_id: "quotation_created", // ID do template no banco de dados
              recipient_email: selectedCustomer.email,
              recipient_name: selectedCustomer.full_name,
              variables: {
                customer_name: selectedCustomer.full_name,
                quotation_id: quotation.id,
                total: total.toFixed(2),
                products: quoteItems.map(item => `${item.name} (${item.quantity}x)`).join(", "),
                payment_method: paymentMethod === "pix" ? "PIX (5% de desconto)" : 
                               paymentMethod === "boleto" ? "Boleto Bancário" : "Cartão de Crédito"
              }
            }
          });
          
          // Atualizar status de envio
          await supabase
            .from("quotations")
            .update({ 
              sent_by_email: true,
              status: "sent"
            })
            .eq("id", quotation.id);
            
          toast.success("Orçamento enviado por e-mail!");
        } catch (emailError) {
          console.error("Erro ao enviar e-mail:", emailError);
          toast.error("Erro ao enviar o orçamento por e-mail, mas o orçamento foi salvo!");
        }
      }
      
      onCancel(); // Voltar para a lista
      
    } catch (error: any) {
      console.error("Erro ao criar orçamento:", error);
      toast.error("Erro ao criar orçamento: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedCustomer,
    setSelectedCustomer,
    selectedProducts,
    setSelectedProducts,
    paymentMethod,
    setPaymentMethod,
    discount,
    setDiscount,
    discountType,
    setDiscountType,
    loading,
    handleProductQuantityChange,
    handleCreateQuotation,
  };
};
