
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Constantes para facilitar ajustes futuros
const DISCOUNT_RULES = [
  { min: 1, max: 1, discount: 0 },
  { min: 2, max: 2, discount: 3 },
  { min: 3, max: 4, discount: 6 },
  { min: 5, max: 9, discount: 8 },
  { min: 10, max: 999, discount: 11 },
];

const PAYMENT_FEES = {
  pix: 0.69,
  creditCard: 1.88,
  creditInstallments: {
    upTo6: 3.22,
    upTo10: 3.52,
  },
};

const PIX_DISCOUNT = 3; // 3% de desconto para PIX

interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
}

interface ProductQuantity {
  id: string;
  quantity: number;
}

const PriceCalculator = () => {
  const [quantities, setQuantities] = useState<ProductQuantity[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<"pix" | "credit">("pix");
  const [installments, setInstallments] = useState<number>(1);

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, omie_code")
        .in("omie_code", ["HB1540", "HB2030", "HB3040", "BH3040"])
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  // Inicializa as quantidades quando os produtos são carregados
  useEffect(() => {
    if (products) {
      setQuantities(
        products.map((product) => ({
          id: product.id,
          quantity: 0,
        }))
      );
    }
  }, [products]);

  const getTotalQuantity = () => {
    return quantities.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getQuantityDiscount = () => {
    const total = getTotalQuantity();
    const rule = DISCOUNT_RULES.find(
      (r) => total >= r.min && total <= r.max
    );
    return rule?.discount || 0;
  };

  const calculateSubtotal = () => {
    if (!products) return 0;
    
    return quantities.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.id);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const calculateTotalWithDiscount = () => {
    const subtotal = calculateSubtotal();
    const quantityDiscount = getQuantityDiscount();
    const discountMultiplier = (100 - quantityDiscount) / 100;
    
    if (selectedPayment === "pix") {
      const pixDiscountMultiplier = (100 - PIX_DISCOUNT) / 100;
      return subtotal * discountMultiplier * pixDiscountMultiplier;
    }
    
    return subtotal * discountMultiplier;
  };

  const calculateInstallmentValue = () => {
    if (selectedPayment !== "credit" || !installments) return 0;
    
    const total = calculateTotalWithDiscount();
    const fee = installments <= 6 
      ? PAYMENT_FEES.creditInstallments.upTo6 
      : PAYMENT_FEES.creditInstallments.upTo10;
    
    const totalWithFee = total * (1 + fee / 100);
    return totalWithFee / installments;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculadora de Preços</CardTitle>
        <CardDescription>
          Calcule preços e descontos baseados na quantidade
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tabela de Produtos */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Preço Unitário</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={
                      quantities.find((q) => q.id === product.id)?.quantity || 0
                    }
                    onChange={(e) => {
                      const newQuantities = quantities.map((q) =>
                        q.id === product.id
                          ? { ...q, quantity: parseInt(e.target.value) || 0 }
                          : q
                      );
                      setQuantities(newQuantities);
                    }}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>
                  R$ {((quantities.find((q) => q.id === product.id)?.quantity || 0) * product.price).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Forma de Pagamento */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Forma de Pagamento</Label>
            <Select
              value={selectedPayment}
              onValueChange={(value: "pix" | "credit") => {
                setSelectedPayment(value);
                if (value === "pix") setInstallments(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="credit">Cartão de Crédito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedPayment === "credit" && (
            <div className="space-y-2">
              <Label>Parcelas</Label>
              <Select
                value={installments.toString()}
                onValueChange={(value) => setInstallments(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n}x
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Resumo */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Quantidade Total:</span>
                <span>{getTotalQuantity()} produtos</span>
              </div>
              <div className="flex justify-between">
                <span>Desconto por Quantidade:</span>
                <span>{getQuantityDiscount()}%</span>
              </div>
              {selectedPayment === "pix" && (
                <div className="flex justify-between">
                  <span>Desconto PIX:</span>
                  <span>{PIX_DISCOUNT}%</span>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <span>Subtotal:</span>
                <span>R$ {calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total Final:</span>
                <span>R$ {calculateTotalWithDiscount().toFixed(2)}</span>
              </div>
              {selectedPayment === "credit" && installments > 1 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{installments}x de:</span>
                  <span>R$ {calculateInstallmentValue().toFixed(2)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Button variant="outline">Limpar</Button>
          <Button>Aplicar ao Pedido</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceCalculator;
