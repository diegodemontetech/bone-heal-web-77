
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface NotificationSetting {
  id?: string;
  user_id: string;
  new_tickets: boolean;
  ticket_updates: boolean;
  system_updates: boolean;
  email_notifications: boolean;
  browser_notifications: boolean;
  sla_alerts: boolean;
}

const NotificationSettings = () => {
  const { profile } = useAuth();
  const [settings, setSettings] = useState<NotificationSetting>({
    user_id: "",
    new_tickets: true,
    ticket_updates: true,
    system_updates: true,
    email_notifications: true,
    browser_notifications: false,
    sla_alerts: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      fetchSettings();
    }
  }, [profile]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("notification_settings")
        .select("*")
        .eq("user_id", profile?.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setSettings(data);
      } else {
        // Criar configurações padrão se não existirem
        const defaultSettings: NotificationSetting = {
          user_id: profile?.id || "",
          new_tickets: true,
          ticket_updates: true,
          system_updates: true,
          email_notifications: true,
          browser_notifications: false,
          sla_alerts: true,
        };
        
        await createDefaultSettings(defaultSettings);
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
      toast.error("Erro ao carregar configurações de notificação");
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async (defaultSettings: NotificationSetting) => {
    try {
      const { error } = await supabase
        .from("notification_settings")
        .insert(defaultSettings);
      
      if (error) throw error;
    } catch (error) {
      console.error("Erro ao criar configurações padrão:", error);
    }
  };

  const handleToggle = async (field: keyof NotificationSetting) => {
    try {
      const newValue = !settings[field];
      
      const { error } = await supabase
        .from("notification_settings")
        .update({ [field]: newValue })
        .eq("user_id", profile?.id);
      
      if (error) throw error;
      
      setSettings(prev => ({ ...prev, [field]: newValue }));
      toast.success("Configuração atualizada com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar configuração:", error);
      toast.error("Erro ao salvar configuração");
    }
  };

  const requestBrowserPermission = async () => {
    try {
      if (!("Notification" in window)) {
        toast.error("Este navegador não suporta notificações");
        return;
      }

      const permission = await Notification.requestPermission();
      
      if (permission === "granted") {
        await handleToggle("browser_notifications");
        toast.success("Notificações do navegador ativadas");
      } else {
        toast.error("Permissão para notificações negada");
      }
    } catch (error) {
      console.error("Erro ao solicitar permissão:", error);
      toast.error("Erro ao configurar notificações do navegador");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Configurações de Notificação</h1>
        <Card>
          <CardHeader>
            <CardTitle>Carregando...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Configurações de Notificação</h1>
      
      <Tabs defaultValue="alerts">
        <TabsList className="mb-4">
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="delivery">Método de Entrega</TabsTrigger>
          <TabsTrigger value="sla">Configurações de SLA</TabsTrigger>
        </TabsList>
        
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Alertas</CardTitle>
              <CardDescription>
                Configure quais tipos de notificações você deseja receber
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-tickets" className="font-medium">Novos Chamados</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações quando novos chamados forem abertos
                  </p>
                </div>
                <Switch
                  id="new-tickets"
                  checked={settings.new_tickets}
                  onCheckedChange={() => handleToggle("new_tickets")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ticket-updates" className="font-medium">Atualizações de Chamados</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações quando chamados forem atualizados
                  </p>
                </div>
                <Switch
                  id="ticket-updates"
                  checked={settings.ticket_updates}
                  onCheckedChange={() => handleToggle("ticket_updates")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="system-updates" className="font-medium">Atualizações do Sistema</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações sobre atualizações e manutenções do sistema
                  </p>
                </div>
                <Switch
                  id="system-updates"
                  checked={settings.system_updates}
                  onCheckedChange={() => handleToggle("system_updates")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Entrega</CardTitle>
              <CardDescription>
                Configure como deseja receber suas notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="font-medium">Notificações por E-mail</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações por e-mail
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.email_notifications}
                  onCheckedChange={() => handleToggle("email_notifications")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="browser-notifications" className="font-medium">Notificações no Navegador</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações push no navegador
                  </p>
                </div>
                {settings.browser_notifications ? (
                  <Switch
                    id="browser-notifications"
                    checked={settings.browser_notifications}
                    onCheckedChange={() => handleToggle("browser_notifications")}
                  />
                ) : (
                  <Button onClick={requestBrowserPermission} size="sm">
                    Ativar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sla">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de SLA</CardTitle>
              <CardDescription>
                Configure alertas relacionados ao SLA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Informação</AlertTitle>
                <AlertDescription>
                  Configurações de SLA determinam quando você receberá alertas sobre chamados que estão próximos ou violaram o SLA definido.
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sla-alerts" className="font-medium">Alertas de SLA</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas quando chamados estiverem prestes a violar SLA
                  </p>
                </div>
                <Switch
                  id="sla-alerts"
                  checked={settings.sla_alerts}
                  onCheckedChange={() => handleToggle("sla_alerts")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationSettings;
