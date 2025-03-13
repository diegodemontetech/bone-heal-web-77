
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NotificationSetting {
  id?: string;
  new_tickets: boolean;
  ticket_updates: boolean;
  system_updates: boolean;
  email_notifications: boolean;
  browser_notifications: boolean;
  sla_alerts: boolean;
  user_id?: string;
}

const ProfileNotificationSettings = () => {
  const { profile } = useAuth();
  const [settings, setSettings] = useState<NotificationSetting>({
    new_tickets: true,
    ticket_updates: true,
    system_updates: true,
    email_notifications: true,
    browser_notifications: false,
    sla_alerts: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchSettings();
    }
  }, [profile]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("notification_settings")
        .select("*")
        .eq("user_id", profile?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
      toast.error("Erro ao carregar configurações de notificação");
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const settingsData = {
        ...settings,
        user_id: profile.id
      };
      
      let result;
      
      if (settings.id) {
        // Atualizar configurações existentes
        result = await supabase
          .from("notification_settings")
          .update(settingsData)
          .eq("id", settings.id);
      } else {
        // Criar novas configurações
        result = await supabase
          .from("notification_settings")
          .insert([settingsData]);
      }
      
      if (result.error) throw result.error;
      
      toast.success("Configurações de notificação salvas com sucesso");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações de notificação");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: keyof NotificationSetting) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Configurações de Notificação</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="ticket_updates" className="flex-1">
              Atualizações em meus chamados
            </Label>
            <Switch 
              id="ticket_updates" 
              checked={settings.ticket_updates}
              onCheckedChange={() => handleToggle('ticket_updates')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="system_updates" className="flex-1">
              Novidades e promoções
            </Label>
            <Switch 
              id="system_updates" 
              checked={settings.system_updates}
              onCheckedChange={() => handleToggle('system_updates')}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Canais de Notificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email_notifications" className="flex-1">
              Notificações por email
            </Label>
            <Switch 
              id="email_notifications" 
              checked={settings.email_notifications}
              onCheckedChange={() => handleToggle('email_notifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="browser_notifications" className="flex-1">
              Notificações no navegador
            </Label>
            <Switch 
              id="browser_notifications" 
              checked={settings.browser_notifications}
              onCheckedChange={() => handleToggle('browser_notifications')}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileNotificationSettings;
