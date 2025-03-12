
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useOrderCustomers } from "@/hooks/useOrderCustomers";

interface CustomerSelectionProps {
  selectedCustomer: any;
  setSelectedCustomer: (customer: any) => void;
}

const CustomerSelection = ({ selectedCustomer, setSelectedCustomer }: CustomerSelectionProps) => {
  const {
    customers,
    isLoadingCustomers,
    customerSearchTerm,
    setCustomerSearchTerm,
    customerDialogOpen,
    setCustomerDialogOpen,
    handleRegistrationSuccess
  } = useOrderCustomers();

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
                value={customerSearchTerm}
                onChange={(e) => setCustomerSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto border rounded-md">
              {isLoadingCustomers ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : customers.length > 0 ? (
                customers.map(customer => (
                  <div
                    key={customer.id}
                    className="p-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <p className="font-medium">{customer.full_name || "Sem nome"}</p>
                    <p className="text-sm text-muted-foreground">{customer.email || "Sem email"}</p>
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
