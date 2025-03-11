
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Tag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface QuotationSummaryProps {
  selectedCustomer: any;
  selectedProducts: any[];
  loading: boolean;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  discount: number;
  setDiscount: (discount: number) => void;
  discountType: string;
  setDiscountType: (type: string) => void;
  onCreateQuotation: () => void;
  onCancel: () => void;
}

const QuotationSummary = ({
  selectedCustomer,
  selectedProducts,
  loading,
  paymentMethod,
  setPaymentMethod,
  discount,
  setDiscount,
  discountType,
  setDiscountType,
  onCreateQuotation,
  onCancel,
}: QuotationSummaryProps) => {
  const [voucherCode, setVoucherCode] = useState("");
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  
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

  const calculateSubtotal = () => {
    return selectedProducts.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const calculateDiscountAmount = () => {
    const subtotal = calculateSubtotal();
    
    // Se tiver um cupom aplicado, usa o desconto dele
    if (appliedVoucher) {
      if (appliedVoucher.discount_type === "percentage") {
        return subtotal * (appliedVoucher.discount_value / 100);
      } else if (appliedVoucher.discount_type === "fixed") {
        return appliedVoucher.discount_value;
      } 
      // Se for frete grátis, não afeta o valor do produto diretamente
      return 0;
    }
    
    // Se não tiver cupom, usa o desconto manual
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
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
      
      const subtotal = calculateSubtotal();
      if (data.min_amount && subtotal < data.min_amount) {
        toast.error(`Este cupom exige um valor mínimo de ${formatCurrency(data.min_amount)}`);
        return;
      }
      
      const totalItems = selectedProducts.reduce((acc, item) => acc + item.quantity, 0);
      if (data.min_items && totalItems < data.min_items) {
        toast.error(`Este cupom exige no mínimo ${data.min_items} itens`);
        return;
      }
      
      // Se chegou até aqui, o cupom é válido
      setAppliedVoucher(data);
      
      // Atualizar o tipo e valor do desconto com base no cupom
      if (data.discount_type === "percentage") {
        setDiscountType("percentage");
        setDiscount(data.discount_value);
      } else if (data.discount_type === "fixed") {
        setDiscountType("fixed");
        setDiscount(data.discount_value);
      }
      
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
    setDiscount(0);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Resumo do Orçamento</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Forma de Pagamento</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pix">PIX (5% de desconto)</SelectItem>
                <SelectItem value="boleto">Boleto Bancário</SelectItem>
                <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Seção de cupom */}
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
          
          {/* Desconto manual (só visível se não tiver cupom aplicado) */}
          {!appliedVoucher && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Desconto</Label>
                <Select value={discountType} onValueChange={setDiscountType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                    <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount">
                  {discountType === "percentage" ? "Desconto (%)" : "Desconto (R$)"}
                </Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>
            </div>
          )}
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between">
              <span>Desconto:</span>
              <span className="text-red-500">- {formatCurrency(calculateDiscountAmount())}</span>
            </div>
            {appliedVoucher?.discount_type === "shipping" && (
              <div className="flex justify-between text-green-600">
                <span>Frete:</span>
                <span>Grátis</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
          
          <div className="pt-4 space-y-2">
            <Button
              className="w-full"
              disabled={!selectedCustomer || selectedProducts.length === 0 || loading}
              onClick={onCreateQuotation}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  Criar Orçamento
                </>
              )}
            </Button>
            
            <Button variant="outline" className="w-full" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotationSummary;
