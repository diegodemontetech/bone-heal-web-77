
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Search, UserPlus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomerDisplay } from "../../order/CustomerDisplay";

interface CustomerSelectionProps {
  selectedCustomer: any;
  setSelectedCustomer: (customer: any) => void;
}

const CustomerSelection = ({ selectedCustomer, setSelectedCustomer }: CustomerSelectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
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

  return (
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
  );
};

export default CustomerSelection;
