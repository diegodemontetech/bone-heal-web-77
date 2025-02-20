
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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

interface CreateOrderProps {
  onCancel: () => void;
}

const CreateOrder = ({ onCancel }: CreateOrderProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
        .eq('active', true)
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

      setLoading(true);

      // Preparar itens do pedido
      const orderItems = selectedProducts.map(product => ({
        product_id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: product.price
      }));

      // Criar pedido
      const { error: orderError } = await supabase.from("orders").insert({
        user_id: selectedCustomer.id,
        items: orderItems,
        total_amount: calculateTotal(),
        status: "pending",
        omie_status: "novo"
      });

      if (orderError) throw orderError;

      toast.success("Pedido criado com sucesso!");
      onCancel();
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error("Erro ao criar pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulário */}
        <Card>
          <CardContent className="p-6 space-y-6">
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
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          R$ {product.price.toFixed(2)}
                        </p>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        className="w-20"
                        value={
                          selectedProducts.find((p) => p.id === product.id)
                            ?.quantity || 0
                        }
                        onChange={(e) => {
                          const quantity = parseInt(e.target.value);
                          if (quantity > 0) {
                            setSelectedProducts((prev) => {
                              const existing = prev.find(
                                (p) => p.id === product.id
                              );
                              if (existing) {
                                return prev.map((p) =>
                                  p.id === product.id
                                    ? { ...p, quantity }
                                    : p
                                );
                              }
                              return [
                                ...prev,
                                {
                                  ...product,
                                  quantity,
                                },
                              ];
                            });
                          } else {
                            setSelectedProducts((prev) =>
                              prev.filter((p) => p.id !== product.id)
                            );
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resumo */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
            <div className="space-y-4">
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">
                    R$ {calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full"
                  onClick={handleCreateOrder}
                  disabled={loading || !selectedCustomer || selectedProducts.length === 0}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Criando Pedido...
                    </>
                  ) : (
                    'Criar Pedido'
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateOrder;
