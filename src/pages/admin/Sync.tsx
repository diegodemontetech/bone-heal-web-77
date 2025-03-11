
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RefreshCw, Server, Database, CheckCircle2, AlertCircle, Info, Settings, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const Sync = () => {
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedSync, setSelectedSync] = useState("all");
  const [syncInterval, setSyncInterval] = useState("daily");
  const [autoSync, setAutoSync] = useState(true);
  
  const [syncHistory] = useState([
    { id: 1, type: "Clientes", date: "15/10/2023 10:30", status: "success", records: 245 },
    { id: 2, type: "Produtos", date: "15/10/2023 10:15", status: "success", records: 128 },
    { id: 3, type: "Pedidos", date: "14/10/2023 22:00", status: "failed", records: 0, error: "Erro de conexão" },
    { id: 4, type: "Estoque", date: "14/10/2023 15:45", status: "success", records: 128 },
    { id: 5, type: "Financeiro", date: "13/10/2023 09:30", status: "partial", records: 87, error: "3 registros com erro" }
  ]);
  
  const [integrations] = useState([
    { id: "omie", name: "Omie ERP", status: "connected", lastSync: "15/10/2023 10:30" },
    { id: "mercadopago", name: "Mercado Pago", status: "connected", lastSync: "15/10/2023 09:15" },
    { id: "correios", name: "Correios", status: "connected", lastSync: "14/10/2023 18:20" },
    { id: "analytics", name: "Google Analytics", status: "disconnected", lastSync: "—" }
  ]);

  const startSync = () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    setSyncProgress(0);
    
    toast.info(`Iniciando sincronização de ${
      selectedSync === "all" ? "todos os dados" : 
      selectedSync === "customers" ? "clientes" :
      selectedSync === "products" ? "produtos" :
      selectedSync === "orders" ? "pedidos" :
      selectedSync === "inventory" ? "estoque" : "dados"
    }`);
    
    // Simulação do progresso
    const intervalId = setInterval(() => {
      setSyncProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 10);
        
        if (newProgress >= 100) {
          clearInterval(intervalId);
          setTimeout(() => {
            setIsSyncing(false);
            toast.success("Sincronização concluída com sucesso!");
          }, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 600);
  };

  const connectIntegration = (id: string) => {
    toast.success(`Integração com ${id} configurada com sucesso!`);
  };

  const toggleAutoSync = () => {
    setAutoSync(!autoSync);
    toast.success(`Sincronização automática ${!autoSync ? "ativada" : "desativada"}`);
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <RefreshCw className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Sincronização</h1>
      </div>

      <Tabs defaultValue="sync" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="sync">Sincronização</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sincronização Manual</CardTitle>
              <CardDescription>
                Sincronize dados entre o portal e sistemas externos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="syncType">Tipo de Sincronização</Label>
                    <Select
                      value={selectedSync}
                      onValueChange={setSelectedSync}
                    >
                      <SelectTrigger id="syncType">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Dados</SelectItem>
                        <SelectItem value="customers">Clientes</SelectItem>
                        <SelectItem value="products">Produtos</SelectItem>
                        <SelectItem value="orders">Pedidos</SelectItem>
                        <SelectItem value="inventory">Estoque</SelectItem>
                        <SelectItem value="financial">Financeiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="syncDirection">Direção</Label>
                    <Select defaultValue="bidirectional">
                      <SelectTrigger id="syncDirection">
                        <SelectValue placeholder="Selecione a direção" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="push">Portal → Sistemas Externos</SelectItem>
                        <SelectItem value="pull">Sistemas Externos → Portal</SelectItem>
                        <SelectItem value="bidirectional">Bidirecional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={startSync} 
                    disabled={isSyncing}
                    className="w-full mt-2"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? "Sincronizando..." : "Iniciar Sincronização"}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between mb-1">
                      <Label>Progresso</Label>
                      <span className="text-sm text-muted-foreground">{syncProgress}%</span>
                    </div>
                    <Progress value={syncProgress} />
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <h3 className="text-sm font-medium">Status</h3>
                    {isSyncing ? (
                      <div className="flex items-center text-blue-600">
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        <span>Sincronização em andamento</span>
                      </div>
                    ) : syncProgress === 100 ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        <span>Última sincronização concluída com sucesso</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-muted-foreground">
                        <Info className="h-4 w-4 mr-2" />
                        <span>Pronto para sincronizar</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Clientes</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">243</div>
                <p className="text-xs text-muted-foreground">Última sincronização: 15/10/2023 10:30</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Produtos</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <p className="text-xs text-muted-foreground">Última sincronização: 15/10/2023 10:15</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Pedidos</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">56</div>
                <p className="text-xs text-muted-foreground">Última sincronização: 14/10/2023 22:00</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{integration.name}</CardTitle>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      integration.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {integration.status === 'connected' ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                  <CardDescription>
                    {integration.status === 'connected' 
                      ? `Última sincronização: ${integration.lastSync}`
                      : 'Configure a integração para começar'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-end">
                  {integration.status === 'connected' ? (
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-3 w-3 mr-2" />
                        Sincronizar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-3 w-3 mr-2" />
                        Configurar
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => connectIntegration(integration.id)}>
                      Conectar
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Sincronização</CardTitle>
              <CardDescription>
                Defina como e quando os dados devem ser sincronizados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">Sincronização Automática</h3>
                  <p className="text-sm text-muted-foreground">Sincronize dados automaticamente conforme programado</p>
                </div>
                <Switch 
                  checked={autoSync}
                  onCheckedChange={toggleAutoSync}
                />
              </div>
              
              {autoSync && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="syncInterval">Intervalo de Sincronização</Label>
                    <Select
                      value={syncInterval}
                      onValueChange={setSyncInterval}
                    >
                      <SelectTrigger id="syncInterval">
                        <SelectValue placeholder="Selecione o intervalo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">A cada hora</SelectItem>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {syncInterval === 'custom' && (
                    <div className="space-y-2">
                      <Label htmlFor="customInterval">Intervalo Personalizado (minutos)</Label>
                      <Input
                        id="customInterval"
                        type="number"
                        min={5}
                        defaultValue={60}
                      />
                    </div>
                  )}
                </>
              )}
              
              <div className="space-y-2">
                <Label>Dados a Sincronizar</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sync-customers" defaultChecked className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="sync-customers">Clientes</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sync-products" defaultChecked className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="sync-products">Produtos</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sync-orders" defaultChecked className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="sync-orders">Pedidos</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sync-inventory" defaultChecked className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="sync-inventory">Estoque</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sync-financial" defaultChecked className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="sync-financial">Financeiro</label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">Notificações</h3>
                  <p className="text-sm text-muted-foreground">Receba notificações sobre falhas na sincronização</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button>
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Sincronização</CardTitle>
              <CardDescription>
                Veja o histórico completo de sincronizações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto rounded-md border">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Tipo</th>
                      <th scope="col" className="px-6 py-3">Data/Hora</th>
                      <th scope="col" className="px-6 py-3">Registros</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Detalhes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {syncHistory.map((item) => (
                      <tr key={item.id} className="bg-white border-b">
                        <td className="px-6 py-4">{item.type}</td>
                        <td className="px-6 py-4">{item.date}</td>
                        <td className="px-6 py-4">{item.records}</td>
                        <td className="px-6 py-4">
                          {item.status === 'success' ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              <span>Sucesso</span>
                            </div>
                          ) : item.status === 'failed' ? (
                            <div className="flex items-center text-red-600">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              <span>Falha</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-yellow-600">
                              <Info className="h-4 w-4 mr-1" />
                              <span>Parcial</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {item.error ? (
                            <span className="text-red-600">{item.error}</span>
                          ) : (
                            <Button variant="ghost" size="sm">
                              Ver detalhes
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline">
                  Ver Todo Histórico
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sync;
