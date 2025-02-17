
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatCurrency } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CreateOrderProps {
  onCancel: () => void;
}

const CreateOrder = ({ onCancel }: CreateOrderProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  // Buscar clientes
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers", search],
    queryFn: async () => {
      if (!search) return [];
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("full_name", `%${search}%`)
        .limit(10);

      if (error) {
        console.error("Error fetching customers:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!search,
  });

  // Buscar produtos
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching products:", error);
        return [];
      }
      
      return data || [];
    },
  });

  // Calcular total
  const calculateTotal = () => {
    return selectedProducts.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  // Criar pedido
  const handleCreateOrder = async () => {
    try {
      if (!selectedCustomer) {
        toast.error("Selecione um cliente");
        return;
      }

      if (selectedProducts.length === 0) {
        toast.error("Adicione pelo menos um produto");
        return;
      }

      // Calcular frete via OMIE
      const { data: shipping, error: shippingError } = await supabase.functions.invoke(
        "omie-integration",
        {
          body: {
            action: "calculate_shipping",
            zip_code: selectedCustomer.zip_code,
            items: selectedProducts,
          },
        }
      );

      if (shippingError) throw shippingError;

      // Criar pedido
      const { error: orderError } = await supabase.from("orders").insert({
        user_id: selectedCustomer.id,
        items: selectedProducts,
        subtotal: calculateTotal(),
        shipping_fee: shipping?.value || 0,
        total_amount: calculateTotal() + (shipping?.value || 0),
        status: "pending",
      });

      if (orderError) throw orderError;

      toast.success("Pedido criado com sucesso!");
      onCancel();
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error("Erro ao criar pedido");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Cliente</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedCustomer
                ? selectedCustomer.full_name
                : "Selecione um cliente..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput
                placeholder="Buscar cliente..."
                value={search}
                onValueChange={setSearch}
              />
              <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
              <CommandGroup>
                {isLoadingCustomers ? (
                  <div className="flex justify-center p-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  customers.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      value={customer.id}
                      onSelect={() => {
                        setSelectedCustomer(customer);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCustomer?.id === customer.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {customer.full_name}
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium">Produtos</label>
        {isLoadingProducts ? (
          <div className="flex justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(product.price)}
                  </p>
                </div>
                <Input
                  type="number"
                  min="0"
                  className="w-20"
                  value={
                    selectedProducts.find((p) => p.product_id === product.id)
                      ?.quantity || 0
                  }
                  onChange={(e) => {
                    const quantity = parseInt(e.target.value);
                    if (quantity > 0) {
                      setSelectedProducts((prev) => {
                        const existing = prev.find(
                          (p) => p.product_id === product.id
                        );
                        if (existing) {
                          return prev.map((p) =>
                            p.product_id === product.id
                              ? { ...p, quantity }
                              : p
                          );
                        }
                        return [
                          ...prev,
                          {
                            product_id: product.id,
                            name: product.name,
                            price: product.price,
                            quantity,
                          },
                        ];
                      });
                    } else {
                      setSelectedProducts((prev) =>
                        prev.filter((p) => p.product_id !== product.id)
                      );
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between text-lg font-medium">
          <span>Total:</span>
          <span>{formatCurrency(calculateTotal())}</span>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleCreateOrder}>Criar Pedido</Button>
      </div>
    </div>
  );
};

export default CreateOrder;
