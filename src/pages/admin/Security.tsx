
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Lock, Users, KeyRound, AlertTriangle, Check, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Security = () => {
  const [securitySettings, setSecuritySettings] = useState({
    allowNewRegistrations: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    requireStrongPasswords: true,
    twoFactorAuthEnabled: false,
    ipRestriction: false,
    allowedIps: ""
  });
  
  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Website Integration", key: "**********", status: "active", created: "2023-05-15", expires: "2024-05-15" },
    { id: "2", name: "Mobile App", key: "**********", status: "active", created: "2023-06-10", expires: "2024-06-10" },
    { id: "3", name: "External Partner", key: "**********", status: "revoked", created: "2023-04-01", expires: "2023-10-01" }
  ]);
  
  const [auditLogs, setAuditLogs] = useState([
    { id: "1", action: "Login", user: "admin@boneheal.com", timestamp: "2023-10-15 14:32:15", ipAddress: "192.168.1.1", status: "success" },
    { id: "2", action: "Password Change", user: "user@example.com", timestamp: "2023-10-14 10:15:42", ipAddress: "192.168.1.2", status: "success" },
    { id: "3", action: "Login Failed", user: "unknown@test.com", timestamp: "2023-10-14 08:45:21", ipAddress: "192.168.1.3", status: "failed" }
  ]);

  const handleToggleSetting = (setting: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    toast.success(`Configuração ${securitySettings[setting] ? "desativada" : "ativada"} com sucesso!`);
  };

  const handleNumberSetting = (setting: keyof typeof securitySettings, value: number) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleTextSetting = (setting: keyof typeof securitySettings, value: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveSettings = () => {
    // Simulação de salvamento
    toast.success("Configurações salvas com sucesso!");
  };

  const generateNewApiKey = () => {
    // Simulação de geração de nova chave
    toast.success("Nova chave API gerada com sucesso!");
  };

  const revokeApiKey = (id: string) => {
    // Simulação de revogação
    setApiKeys(prevKeys => 
      prevKeys.map(key => 
        key.id === id ? {...key, status: "revoked"} : key
      )
    );
    toast.success("Chave API revogada com sucesso!");
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Segurança</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="api">Chaves API</TabsTrigger>
          <TabsTrigger value="audit">Logs de Auditoria</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Autenticação</CardTitle>
              <CardDescription>Configure políticas de acesso e segurança do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">Permitir Novos Registros</h3>
                  <p className="text-sm text-muted-foreground">Permite que novos usuários se registrem no sistema</p>
                </div>
                <Switch 
                  checked={securitySettings.allowNewRegistrations}
                  onCheckedChange={() => handleToggleSetting('allowNewRegistrations')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">Verificação de Email</h3>
                  <p className="text-sm text-muted-foreground">Exige verificação de email antes do primeiro login</p>
                </div>
                <Switch 
                  checked={securitySettings.requireEmailVerification}
                  onCheckedChange={() => handleToggleSetting('requireEmailVerification')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">Autenticação de Dois Fatores</h3>
                  <p className="text-sm text-muted-foreground">Habilita opção de 2FA para usuários</p>
                </div>
                <Switch 
                  checked={securitySettings.twoFactorAuthEnabled}
                  onCheckedChange={() => handleToggleSetting('twoFactorAuthEnabled')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">Senhas Fortes</h3>
                  <p className="text-sm text-muted-foreground">Exige maiúsculas, minúsculas, números e símbolos</p>
                </div>
                <Switch 
                  checked={securitySettings.requireStrongPasswords}
                  onCheckedChange={() => handleToggleSetting('requireStrongPasswords')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minPasswordLength">Tamanho Mínimo de Senha</Label>
                <Input
                  id="minPasswordLength"
                  type="number"
                  value={securitySettings.minPasswordLength}
                  onChange={(e) => handleNumberSetting('minPasswordLength', parseInt(e.target.value))}
                  min={6}
                  max={24}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">Restrição de IP</h3>
                  <p className="text-sm text-muted-foreground">Limita acesso a IPs específicos</p>
                </div>
                <Switch 
                  checked={securitySettings.ipRestriction}
                  onCheckedChange={() => handleToggleSetting('ipRestriction')}
                />
              </div>
              
              {securitySettings.ipRestriction && (
                <div className="space-y-2">
                  <Label htmlFor="allowedIps">IPs Permitidos (separados por vírgula)</Label>
                  <Input
                    id="allowedIps"
                    placeholder="192.168.1.1, 10.0.0.1"
                    value={securitySettings.allowedIps}
                    onChange={(e) => handleTextSetting('allowedIps', e.target.value)}
                  />
                </div>
              )}
              
              <div className="flex justify-end">
                <Button onClick={saveSettings}>
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chaves de API</CardTitle>
              <CardDescription>Gerencie chaves de API para integração com sistemas externos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-end">
                <Button onClick={generateNewApiKey}>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Gerar Nova Chave
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Chave</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criada em</TableHead>
                    <TableHead>Expira em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell className="font-medium">{apiKey.name}</TableCell>
                      <TableCell>{apiKey.key}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          apiKey.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {apiKey.status === 'active' ? 'Ativa' : 'Revogada'}
                        </span>
                      </TableCell>
                      <TableCell>{apiKey.created}</TableCell>
                      <TableCell>{apiKey.expires}</TableCell>
                      <TableCell className="text-right">
                        {apiKey.status === 'active' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 hover:bg-red-50"
                            onClick={() => revokeApiKey(apiKey.id)}
                          >
                            Revogar
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled
                          >
                            Revogada
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Auditoria</CardTitle>
              <CardDescription>Visualize atividades de segurança e acessos ao sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ação</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Endereço IP</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.ipAddress}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {log.status === 'success' ? (
                            <>
                              <Check className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-green-600">Sucesso</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-red-600">Falha</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline">
                  Carregar Mais
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Security;
