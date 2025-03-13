
import { TicketsSection } from "./TicketsSection";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { ContactInfoSection } from "./ContactInfoSection";
import { AddressSection } from "./AddressSection";
import { OmieStatusSection } from "./OmieStatusSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Clock, Package } from "lucide-react";

export const ProfileForm = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="contact">Contato</TabsTrigger>
              <TabsTrigger value="address">Endereço</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <PersonalInfoSection />
            </TabsContent>
            <TabsContent value="contact">
              <ContactInfoSection />
            </TabsContent>
            <TabsContent value="address">
              <AddressSection />
            </TabsContent>
          </Tabs>
          <OmieStatusSection />
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <Card className="shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5 text-primary" /> 
                  Meus Pedidos
                </CardTitle>
                <CardDescription>Acompanhe seus pedidos e histórico de compras</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate("/orders")}
                  variant="outline" 
                  className="w-full"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Ver meus pedidos
                </Button>
              </CardContent>
            </Card>
            
            <TicketsSection />
          </div>
        </div>
      </div>
    </div>
  );
};
