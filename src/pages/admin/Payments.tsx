
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CreditCard, DollarSign, Wallet } from "lucide-react";
import Layout from "@/components/admin/Layout";

const Payments = () => {
  const [activeTab, setActiveTab] = useState("mercadopago");
  const [isMercadoPagoEnabled, setIsMercadoPagoEnabled] = useState(true);
  const [isPixEnabled, setIsPixEnabled] = useState(true);
  const [isBoletoEnabled, setIsBoletoEnabled] = useState(true);

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Configurações de Pagamento</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="mercadopago">Mercado Pago</TabsTrigger>
            <TabsTrigger value="paymentMethods">Métodos de Pagamento</TabsTrigger>
            <TabsTrigger value="installments">Parcelamento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mercadopago">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Configurações do Mercado Pago</span>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="mercadopago" 
                      checked={isMercadoPagoEnabled}
                      onCheckedChange={setIsMercadoPagoEnabled}
                    />
                    <Label htmlFor="mercadopago">
                      {isMercadoPagoEnabled ? "Ativado" : "Desativado"}
                    </Label>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="public_key">Chave Pública</Label>
                  <Input id="public_key" placeholder="PUBLIC_KEY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="access_token">Access Token</Label>
                  <Input id="access_token" placeholder="ACCESS_TOKEN" type="password" />
                </div>
                <Button>Salvar Configurações</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="paymentMethods">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-primary" />
                    <span>PIX</span>
                  </div>
                  <Switch 
                    checked={isPixEnabled}
                    onCheckedChange={setIsPixEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span>Cartão de Crédito</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span>Boleto Bancário</span>
                  </div>
                  <Switch 
                    checked={isBoletoEnabled}
                    onCheckedChange={setIsBoletoEnabled}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="installments">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Parcelamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="max_installments">Número Máximo de Parcelas</Label>
                  <Input id="max_installments" type="number" min="1" max="12" defaultValue="12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min_value">Valor Mínimo por Parcela (R$)</Label>
                  <Input id="min_value" type="number" min="5" defaultValue="10" />
                </div>
                <Button>Salvar Configurações</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Payments;
