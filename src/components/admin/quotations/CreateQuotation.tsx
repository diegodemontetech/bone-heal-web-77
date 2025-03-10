
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2, Search, UserPlus, Percent, Mail, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductsList } from "../order/ProductsList";
import { CustomerDisplay } from "../order/CustomerDisplay";

interface CreateQuotationProps {
  onCancel: () => void;
}

const CreateQuotation = ({ onCancel }: CreateQuotationProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("percentage");
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        console.error("Erro ao buscar produtos:", error);
        return [];
      }
      
      return data || [];
    },
  });

  // Buscar clientes
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name");

      if (error) {
        console.error("Erro ao buscar clientes:", error);
        return [];
      }
      
      return data || [];
    },
  });

  // Filtrar clientes com base no termo de busca
  const filteredCustomers = customers.filter(customer => {
    const fullName = customer.full_name?.toLowerCase() || '';
    const email = customer.email?.toLowerCase() || '';
    const searchTermLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchTermLower) || email.includes(searchTermLower);
  });

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

  const handleCreateCustomer = async () => {
    try {
      // Validar campos obrigatórios
      if (!newCustomerForm.full_name || !newCustomerForm.email) {
        toast.error("Nome e e-mail são campos obrigatórios");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .insert({
          ...newCustomerForm,
          role: "dentist"
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar cliente:", error);
        throw error;
      }

      toast.success("Cliente criado com sucesso!");
      setSelectedCustomer(data);
      setCustomerDialogOpen(false);
    } catch (error: any) {
      toast.error("Erro ao criar cliente: " + error.message);
    }
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seleção de Cliente */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cliente</h3>
            
            {!selectedCustomer ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar cliente por nome ou e-mail..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  {isLoadingCustomers ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : filteredCustomers.length > 0 ? (
                    filteredCustomers.map(customer => (
                      <div
                        key={customer.id}
                        className="p-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <p className="font-medium">{customer.full_name}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      Nenhum cliente encontrado
                    </div>
                  )}
                </div>
                
                <Dialog open={customerDialogOpen} onOpenChange={setCustomerDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Cadastrar Novo Cliente
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Nome Completo*</Label>
                          <Input
                            id="fullName"
                            value={newCustomerForm.full_name}
                            onChange={(e) => setNewCustomerForm(prev => ({ ...prev, full_name: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail*</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newCustomerForm.email}
                            onChange={(e) => setNewCustomerForm(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            value={newCustomerForm.phone}
                            onChange={(e) => setNewCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>

                        <Separator />
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Endereço</Label>
                          <Input
                            id="address"
                            value={newCustomerForm.address}
                            onChange={(e) => setNewCustomerForm(prev => ({ ...prev, address: e.target.value }))}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label htmlFor="city">Cidade</Label>
                            <Input
                              id="city"
                              value={newCustomerForm.city}
                              onChange={(e) => setNewCustomerForm(prev => ({ ...prev, city: e.target.value }))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="state">Estado</Label>
                            <Input
                              id="state"
                              value={newCustomerForm.state}
                              onChange={(e) => setNewCustomerForm(prev => ({ ...prev, state: e.target.value }))}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">CEP</Label>
                          <Input
                            id="zipCode"
                            value={newCustomerForm.zip_code}
                            onChange={(e) => setNewCustomerForm(prev => ({ ...prev, zip_code: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setCustomerDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleCreateCustomer}>
                          Cadastrar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="space-y-4">
                <CustomerDisplay customer={selectedCustomer} />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedCustomer(null)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Alterar Cliente
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumo do Orçamento */}
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
                  onClick={handleCreateQuotation}
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
      </div>
      
      {/* Produtos */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Produtos</h3>
          
          <div className="space-y-4">
            <ProductsList
              products={products}
              selectedProducts={selectedProducts}
              isLoading={isLoadingProducts}
              onProductQuantityChange={handleProductQuantityChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateQuotation;
