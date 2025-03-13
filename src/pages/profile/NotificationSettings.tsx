
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '@/hooks/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  const { profile, isLoading } = useAuthContext();
  const [settings, setSettings] = useState<NotificationSetting>({
    user_id: '',
    new_tickets: true,
    ticket_updates: true,
    system_updates: true,
    email_notifications: true,
    browser_notifications: false,
    sla_alerts: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      loadSettings(profile.id);
    }
  }, [profile?.id]);

  const loadSettings = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar configurações:', error);
        toast.error('Erro ao carregar configurações de notificação');
      }

      if (data) {
        setSettings(data);
      } else {
        // Configurações padrão se não existirem
        setSettings({
          user_id: userId,
          new_tickets: true,
          ticket_updates: true,
          system_updates: true,
          email_notifications: true,
          browser_notifications: false,
          sla_alerts: true,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações de notificação');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!profile?.id) return;

    try {
      setSaving(true);

      const { error } = settings.id 
        ? await supabase
            .from('notification_settings')
            .update(settings)
            .eq('id', settings.id)
        : await supabase
            .from('notification_settings')
            .insert({
              ...settings,
              user_id: profile.id
            });

      if (error) {
        console.error('Erro ao salvar configurações:', error);
        toast.error('Erro ao salvar configurações de notificação');
        return;
      }

      toast.success('Configurações de notificação salvas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações de notificação');
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

  if (isLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Notificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="new_tickets" className="flex-1">
                Novos chamados
                <p className="text-sm text-muted-foreground">
                  Receber notificações quando novos chamados forem abertos
                </p>
              </Label>
              <Switch 
                id="new_tickets" 
                checked={settings.new_tickets}
                onCheckedChange={() => handleToggle('new_tickets')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="ticket_updates" className="flex-1">
                Atualizações de chamados
                <p className="text-sm text-muted-foreground">
                  Receber notificações quando houver atualizações em seus chamados
                </p>
              </Label>
              <Switch 
                id="ticket_updates" 
                checked={settings.ticket_updates}
                onCheckedChange={() => handleToggle('ticket_updates')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="system_updates" className="flex-1">
                Atualizações do sistema
                <p className="text-sm text-muted-foreground">
                  Receber notificações sobre atualizações e novidades do sistema
                </p>
              </Label>
              <Switch 
                id="system_updates" 
                checked={settings.system_updates}
                onCheckedChange={() => handleToggle('system_updates')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="email_notifications" className="flex-1">
                Notificações por e-mail
                <p className="text-sm text-muted-foreground">
                  Receber notificações também por e-mail
                </p>
              </Label>
              <Switch 
                id="email_notifications" 
                checked={settings.email_notifications}
                onCheckedChange={() => handleToggle('email_notifications')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="browser_notifications" className="flex-1">
                Notificações do navegador
                <p className="text-sm text-muted-foreground">
                  Receber notificações no navegador (quando disponível)
                </p>
              </Label>
              <Switch 
                id="browser_notifications" 
                checked={settings.browser_notifications}
                onCheckedChange={() => handleToggle('browser_notifications')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sla_alerts" className="flex-1">
                Alertas de SLA
                <p className="text-sm text-muted-foreground">
                  Receber alertas quando um chamado estiver próximo do prazo de SLA
                </p>
              </Label>
              <Switch 
                id="sla_alerts" 
                checked={settings.sla_alerts}
                onCheckedChange={() => handleToggle('sla_alerts')}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={saveSettings} 
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar configurações'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
