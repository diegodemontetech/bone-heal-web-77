import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

const Cart = () => {
  const session = useSession();
  const { cartItems } = useCart();
  const [zipCode, setZipCode] = useState("");
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + (shippingCost || 0);

  const calculateShipping = async () => {
    if (!zipCode || zipCode.length !== 8) {
      toast.error("Por favor, insira um CEP válido");
      return;
    }

    setIsCalculatingShipping(true);
    setShippingError(null);
    
    try {
      console.log("Calculando frete para CEP:", zipCode);
      
      const { data, error } = await supabase.functions.invoke("correios-shipping", {
        body: {
          zipCodeOrigin: "04180112",
          zipCodeDestination: zipCode,
          weight: 1,
          length: 20,
          width: 20,
          height: 20,
        },
      });

      console.log("Resposta do cálculo de frete:", { data, error });

      if (error) throw error;

      if (!data?.pcFinal) {
        throw new Error("Não foi possível calcular o frete para este CEP");
      }

      setShippingCost(data.pcFinal);
      toast.success("Frete calculado com sucesso!", {
        duration: 2000 // 2 segundos
      });
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      setShippingError("Erro ao calcular o frete. Por favor, tente novamente.");
      toast.error("Erro ao calcular o frete. Por favor, tente novamente.", {
        duration: 2000 // 2 segundos
      });
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleCheckout = async () => {
    if (!session) {
      toast.error("Por favor, faça login para continuar", {
        duration: 2000
      });
      return;
    }

    if (!shippingCost) {
      toast.error("Por favor, calcule o frete antes de continuar", {
        duration: 2000
      });
      return;
    }

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: session.user.id,
          total_amount: total,
          items: cartItems as unknown as Json,
          shipping_address: {
            zip_code: zipCode,
            shipping_cost: shippingCost,
          } as Json,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const { error: omieError } = await supabase.functions.invoke("omie-integration", {
        body: { action: "sync_order", order_id: order.id },
      });

      if (omieError) throw omieError;

      toast.success("Pedido criado com sucesso!", {
        duration: 2000
      });
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      toast.error("Erro ao criar o pedido. Por favor, tente novamente.", {
        duration: 2000
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Carrinho</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Seu carrinho está vazio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-white p-4 rounded-lg shadow"
                >
                  <img
                    src={`/products/${item.image}`}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Quantidade: {item.quantity}
                    </p>
                    <p className="font-medium text-primary">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white p-6 rounded-lg shadow space-y-6">
              <h2 className="text-xl font-bold">Resumo do Pedido</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="zipCode">Calcular Frete</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="zipCode"
                      placeholder="CEP"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
                      maxLength={8}
                    />
                    <Button
                      variant="outline"
                      onClick={calculateShipping}
                      disabled={isCalculatingShipping}
                    >
                      {isCalculatingShipping ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Calcular"
                      )}
                    </Button>
                  </div>
                  {shippingError && (
                    <p className="text-sm text-red-500 mt-1">{shippingError}</p>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frete</span>
                    <span>
                      {shippingCost ? `R$ ${shippingCost.toFixed(2)}` : "-"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={!session || !shippingCost}
                >
                  Finalizar Compra
                </Button>

                {!session && (
                  <p className="text-sm text-red-500 text-center">
                    Faça login para continuar com a compra
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;