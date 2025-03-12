
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerDisplay } from "./CustomerDisplay";
import { Search, UserPlus, Loader2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RegistrationForm from "@/components/auth/RegistrationForm";

interface CustomerSelectionProps {
  customers: any[];
  isLoadingCustomers: boolean;
  selectedCustomer: any;
  setSelectedCustomer: (customer: any) => void;
  customerSearchTerm: string;
  setCustomerSearchTerm: (term: string) => void;
  customerDialogOpen: boolean;
  setCustomerDialogOpen: (open: boolean) => void;
  handleRegistrationSuccess: (customer: any) => void;
}

export const CustomerSelection = ({
  customers,
  isLoadingCustomers,
  selectedCustomer,
  setSelectedCustomer,
  customerSearchTerm,
  setCustomerSearchTerm,
  customerDialogOpen,
  setCustomerDialogOpen,
  handleRegistrationSuccess
}: CustomerSelectionProps) => {
  console.log("CustomerSelection renderizando com", customers?.length || 0, "clientes");
  console.log("Cliente selecionado:", selectedCustomer);

  return (
    <div>
      {!selectedCustomer ? (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cliente por nome, e-mail ou telefone..."
              className="pl-8"
              value={customerSearchTerm}
              onChange={(e) => setCustomerSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="max-h-60 overflow-y-auto border rounded-md">
            {isLoadingCustomers ? (
              <div className="flex justify-center p-4">
                <Loader2 className="animate-spin h-6 w-6 text-primary" />
              </div>
            ) : customers && customers.length > 0 ? (
              customers.map(customer => (
                <div
                  key={customer.id}
                  className="p-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    console.log("Cliente selecionado:", customer);
                    setSelectedCustomer(customer);
                  }}
                >
                  <p className="font-medium">{customer.full_name || "Sem nome"}</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.email || "Sem email"}
                    {customer.phone && ` • ${customer.phone}`}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                {customerSearchTerm 
                  ? "Nenhum cliente encontrado com esse termo" 
                  : "Digite para buscar clientes"}
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
    </div>
  );
};
