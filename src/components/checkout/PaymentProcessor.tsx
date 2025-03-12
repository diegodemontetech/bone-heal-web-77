import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth-context";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';
import { stringifyForSupabase } from "@/utils/supabaseJsonUtils";
import { supabase } from "@/integrations/supabase/client";

interface PaymentProcessorProps {
  shippingCost: number;
  voucherDiscount: number;
  voucherId: string | null;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({ shippingCost, voucherDiscount, voucherId }) => {
  const [installments, setInstallments] = useState<number>(1);
  const [processing, setProcessing] = useState<boolean>(false);
  const { cart, getTotalPrice, clearCart } = useCart();
  const { profile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const totalPrice = getTotalPrice();
  const totalWithShipping = totalPrice + shippingCost - voucherDiscount;

  const handlePayment = async () => {
    if (!profile) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para finalizar a compra.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      // Criar pedido no Supabase
      const { data, error } = await supabase.from('orders').insert({
        customer_id: profile.id,
        total_amount: totalWithShipping,
        shipping_cost: shippingCost,
        discount: voucherDiscount,
        installments: installments,
        items: stringifyForSupabase(cart.items),
        voucher_id: voucherId,
      }).select().single();

      if (error) {
        console.error("Erro ao criar pedido:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao criar o pedido. Por favor, tente novamente.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Pedido criado com sucesso!",
      });

      clearCart();
      router.push('/orders');
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="grid gap-4">
        <h2 className="text-lg font-semibold">Resumo do Pedido</h2>
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Frete:</span>
          <span>{formatCurrency(shippingCost)}</span>
        </div>
        {voucherDiscount > 0 && (
          <div className="flex justify-between">
            <span>Desconto:</span>
            <span>-{formatCurrency(voucherDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>{formatCurrency(totalWithShipping)}</span>
        </div>

        <div>
          <Label htmlFor="installments">Parcelas</Label>
          <Select value={installments.toString()} onValueChange={(value) => setInstallments(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1x à vista</SelectItem>
              <SelectItem value="2">2x sem juros</SelectItem>
              <SelectItem value="3">3x sem juros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handlePayment} disabled={processing}>
          {processing ? "Processando..." : "Finalizar Pedido"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentProcessor;
