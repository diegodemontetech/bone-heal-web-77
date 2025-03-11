
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Tag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";

interface VoucherSectionProps {
  voucherCode: string;
  setVoucherCode: (code: string) => void;
  isApplyingVoucher: boolean;
  setIsApplyingVoucher: (isApplying: boolean) => void;
  appliedVoucher: any;
  setAppliedVoucher: (voucher: any) => void;
  paymentMethod: string;
}

const VoucherSection = ({
  voucherCode,
  setVoucherCode,
  isApplyingVoucher,
  setIsApplyingVoucher,
  appliedVoucher,
  setAppliedVoucher,
  paymentMethod,
}: VoucherSectionProps) => {
  // Buscar cupons disponíveis
  const { data: vouchers } = useQuery({
    queryKey: ["vouchers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .lt('current_uses', 'max_uses')
        .is('valid_until', null)
        .eq('payment_method', paymentMethod);
        
      if (error) {
        console.error("Erro ao buscar cupons:", error);
        return [];
      }
      return data || [];
    },
    enabled: !!paymentMethod, // Só busca quando o método de pagamento estiver selecionado
  });

  const handleApplyVoucher = async () => {
    if (!voucherCode) {
      toast.error("Digite um código de cupom");
      return;
    }
    
    setIsApplyingVoucher(true);
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .eq('code', voucherCode.toUpperCase())
        .single();
        
      if (error) {
        toast.error("Cupom não encontrado");
        return;
      }
      
      // Verificar se o cupom é válido
      const now = new Date();
      if (data.valid_until && new Date(data.valid_until) < now) {
        toast.error("Este cupom expirou");
        return;
      }
      
      if (data.max_uses && data.current_uses >= data.max_uses) {
        toast.error("Este cupom atingiu o limite de usos");
        return;
      }
      
      if (data.payment_method && data.payment_method !== paymentMethod) {
        toast.error(`Este cupom é válido apenas para pagamentos via ${data.payment_method}`);
        return;
      }
      
      const subtotal = 0; // Será calculado no componente pai
      if (data.min_amount && subtotal < data.min_amount) {
        toast.error(`Este cupom exige um valor mínimo de ${formatCurrency(data.min_amount)}`);
        return;
      }
      
      const totalItems = 0; // Será calculado no componente pai
      if (data.min_items && totalItems < data.min_items) {
        toast.error(`Este cupom exige no mínimo ${data.min_items} itens`);
        return;
      }
      
      // Se chegou até aqui, o cupom é válido
      setAppliedVoucher(data);
      toast.success("Cupom aplicado com sucesso!");
    } catch (error) {
      console.error("Erro ao aplicar cupom:", error);
      toast.error("Erro ao aplicar cupom");
    } finally {
      setIsApplyingVoucher(false);
    }
  };
  
  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode("");
  };

  return (
    <div className="space-y-2 border p-3 rounded-md">
      <Label className="flex items-center">
        <Tag className="h-4 w-4 mr-2" />
        Cupom de Desconto
      </Label>
      
      {appliedVoucher ? (
        <div className="space-y-2">
          <div className="bg-green-50 p-2 rounded-md flex justify-between items-center">
            <div>
              <p className="font-medium">{appliedVoucher.code}</p>
              <p className="text-sm text-green-700">
                {appliedVoucher.discount_type === "percentage" && `${appliedVoucher.discount_value}% de desconto`}
                {appliedVoucher.discount_type === "fixed" && `${formatCurrency(appliedVoucher.discount_value)} de desconto`}
                {appliedVoucher.discount_type === "shipping" && "Frete grátis"}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRemoveVoucher}
            >
              Remover
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Input
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder="Digite o código do cupom"
            className="flex-1"
          />
          <Button 
            onClick={handleApplyVoucher}
            disabled={isApplyingVoucher || !voucherCode}
          >
            {isApplyingVoucher ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Aplicar
          </Button>
        </div>
      )}
    </div>
  );
};

export default VoucherSection;
