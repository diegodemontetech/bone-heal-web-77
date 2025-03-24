
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerState } from "@/hooks/useCustomerState";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, RefreshCw, CheckCircle, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RegistrationForm from "@/components/auth/RegistrationForm";
import { toast } from "sonner";

const Customers = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");
  
  const {
    customers,
    isLoadingCustomers,
    searchTerm,
    setSearchTerm,
    refreshCustomers
  } = useCustomerState();

  useEffect(() => {
    if (!isAdmin) {
      toast.error("Você não tem permissão para acessar esta página");
      navigate("/admin/dashboard");
    }
  }, [isAdmin, navigate]);

  const handleRegistrationSuccess = () => {
    setIsRegistrationOpen(false);
    refreshCustomers();
    toast.success("Cliente cadastrado com sucesso!");
  };

  // Filtrar clientes com base na aba ativa
  const filteredCustomers = customers.filter(customer => {
    if (activeTab === "todos") return true;
    if (activeTab === "comOmie") return !!customer.omie_code;
    if (activeTab === "semOmie") return !customer.omie_code;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold">Clientes</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshCustomers}
              disabled={isLoadingCustomers}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingCustomers ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            
            <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                </DialogHeader>
                <RegistrationForm 
                  isDentist={true} 
                  isModal={true} 
                  onSuccess={handleRegistrationSuccess}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por nome, email, telefone ou código Omie..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="comOmie">Com Omie</TabsTrigger>
                    <TabsTrigger value="semOmie">Sem Omie</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            {isLoadingCustomers ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : filteredCustomers.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Cidade/UF</TableHead>
                      <TableHead>Omie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.full_name}</TableCell>
                        <TableCell>{customer.email || "-"}</TableCell>
                        <TableCell>{customer.phone || "-"}</TableCell>
                        <TableCell>
                          {customer.city && customer.state 
                            ? `${customer.city}/${customer.state}` 
                            : customer.city || customer.state || "-"}
                        </TableCell>
                        <TableCell>
                          {customer.omie_sync ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span>{customer.omie_code}</span>
                            </div>
                          ) : customer.omie_code ? (
                            <span className="text-yellow-600">{customer.omie_code}</span>
                          ) : (
                            <span className="text-muted-foreground">Não</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "Nenhum cliente encontrado com o termo informado." : "Nenhum cliente cadastrado."}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
