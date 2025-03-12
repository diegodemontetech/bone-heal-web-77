
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import RegistrationForm from "@/components/auth/RegistrationForm";

interface CustomerSelectionProps {
  selectedCustomer: any;
  setSelectedCustomer: (customer: any) => void;
}

const CustomerSelection = ({ selectedCustomer, setSelectedCustomer }: CustomerSelectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);

  // Buscar clientes
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers", searchTerm],
    queryFn: async () => {
      console.log("Buscando clientes com filtro:", searchTerm);
      let query = supabase
        .from("profiles")
        .select("*");
      
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }
      
      query = query.order("full_name");

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar clientes:", error);
        toast.error("Erro ao buscar clientes");
        return [];
      }
      
      console.log(`Encontrados ${data?.length || 0} clientes`);
      return data || [];
    },
  });

  // Filtrar clientes com base no termo de busca
  const filteredCustomers = customers;

  // Quando um novo cliente é registrado com sucesso
  const handleRegistrationSuccess = (newCustomer: any) => {
    setSelectedCustomer(newCustomer);
    setCustomerDialogOpen(false);
    toast.success("Cliente cadastrado com sucesso!");
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
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <RegistrationForm 
                    isDentist={true} 
                    isModal={true} 
                    onSuccess={handleRegistrationSuccess}
                  />
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
