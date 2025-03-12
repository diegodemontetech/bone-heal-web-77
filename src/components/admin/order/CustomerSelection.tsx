
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerDisplay } from "./CustomerDisplay";
import { Search, UserPlus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RegistrationForm from "@/components/auth/RegistrationForm";
import { useState } from "react";
import { Customer } from "@/hooks/useCustomerState";
import { toast } from "sonner";

interface CustomerSelectionProps {
  customers: Customer[];
  isLoadingCustomers: boolean;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const CustomerSelection = ({
  customers,
  isLoadingCustomers,
  selectedCustomer,
  setSelectedCustomer,
  searchTerm,
  setSearchTerm,
}: CustomerSelectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      {!selectedCustomer ? (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Digite nome, e-mail ou telefone do cliente..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="max-h-60 overflow-y-auto border rounded-md">
            {isLoadingCustomers ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : customers.length > 0 ? (
              customers.map(customer => (
                <div
                  key={customer.id}
                  className="p-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <p className="font-medium">{customer.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.email} {customer.phone && `• ${customer.phone}`}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                {searchTerm ? "Nenhum cliente encontrado" : "Digite para buscar clientes"}
              </div>
            )}
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Cadastrar Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
              </DialogHeader>
              <RegistrationForm 
                isDentist={true} 
                isModal={true} 
                onSuccess={(newCustomer) => {
                  console.log("CustomerSelection: recebeu callback com cliente:", newCustomer);
                  setSelectedCustomer(newCustomer);
                  setIsDialogOpen(false);
                  toast.success("Cliente cadastrado com sucesso!");
                }}
              />
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
