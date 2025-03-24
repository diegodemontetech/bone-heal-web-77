
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, Smartphone, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { EvolutionApiTab } from "@/components/admin/whatsapp/settings/EvolutionApiTab";
import { supabase } from "@/integrations/supabase/client";

const ApiEvolution = () => {
  const [evolutionUrl, setEvolutionUrl] = useState("");
  const [evolutionKey, setEvolutionKey] = useState("");
  const [instanceName, setInstanceName] = useState("default");
  const [saving, setSaving] = useState(false);
  const [qrCodeLoading, setQrCodeLoading] = useState(false);

  const loadSettings = async () => {
    try {
      // We'll use the app_settings table with a type filter, which is more likely to exist
      const { data, error } = await supabase
        .from('commercial_conditions')
        .select('*')
        .eq('name', 'whatsapp_evolution_settings')
        .maybeSingle();

      if (error) {
        console.error("Error loading settings:", error);
        return;
      }
      
      if (data) {
        // If we have settings, parse them from the description field
        try {
          const settings = data.description ? JSON.parse(data.description) : {};
          setEvolutionUrl(settings.base_url || "");
          setEvolutionKey(settings.api_key || "");
          setInstanceName(settings.instance_name || "default");
        } catch (e) {
          console.error("Error parsing settings:", e);
        }
      }
    } catch (error) {
      console.error("Error loading configuration:", error);
    }
  };

  // Load settings when the component is mounted
  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      // Prepare settings object to store in description field
      const settings = {
        base_url: evolutionUrl,
        api_key: evolutionKey,
        instance_name: instanceName,
      };
      
      // Check if settings already exist
      const { data: existingData } = await supabase
        .from('commercial_conditions')
        .select('id')
        .eq('name', 'whatsapp_evolution_settings')
        .maybeSingle();
      
      let error;
      
      if (existingData) {
        // Update existing settings
        const { error: updateError } = await supabase
          .from('commercial_conditions')
          .update({
            description: JSON.stringify(settings),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
          
        error = updateError;
      } else {
        // Create new settings
        const { error: insertError } = await supabase
          .from('commercial_conditions')
          .insert({
            name: 'whatsapp_evolution_settings',
            description: JSON.stringify(settings),
            discount_type: 'percentage', // Required field
            discount_value: 0, // Required field
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        error = insertError;
      }

      if (error) throw error;
      
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateInstance = async () => {
    try {
      setQrCodeLoading(true);
      
      const { data, error } = await supabase.functions.invoke('evolution-api', {
        body: {
          action: 'create-instance',
          instanceName
        }
      });

      if (error) throw error;
      
      if (data?.qrcode) {
        // Handle QR code display
        toast.success("Instância criada! Escaneie o QR code para conectar.");
      } else {
        toast.info("Instância criada, mas não foi possível gerar o QR code.");
      }
    } catch (error) {
      console.error("Error creating instance:", error);
      toast.error("Erro ao criar instância");
    } finally {
      setQrCodeLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('evolution-api', {
        body: {
          action: 'instance-status',
          instanceName
        }
      });

      if (error) throw error;
      
      if (data?.status === 'connected') {
        toast.success("WhatsApp conectado!");
      } else if (data?.status === 'connecting') {
        toast.info("WhatsApp está tentando conectar...");
      } else {
        toast.warning("WhatsApp não está conectado.");
      }
    } catch (error) {
      console.error("Error checking status:", error);
      toast.error("Erro ao verificar status da conexão");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">API Evolution (WhatsApp)</h1>
      </div>

      <div className="grid gap-6">
        <EvolutionApiTab
          evolutionUrl={evolutionUrl}
          evolutionKey={evolutionKey}
          instanceName={instanceName}
          saving={saving}
          qrCodeLoading={qrCodeLoading}
          onEvolutionUrlChange={setEvolutionUrl}
          onEvolutionKeyChange={setEvolutionKey}
          onInstanceNameChange={setInstanceName}
          onSaveSettings={handleSaveSettings}
          onCreateInstance={handleCreateInstance}
          onCheckStatus={handleCheckStatus}
        />
        
        <Card>
          <CardHeader>
            <CardTitle>API Evolution</CardTitle>
            <CardDescription>
              API Evolution é uma implementação da API do WhatsApp para integração com sistemas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground">
                Essa integração permite enviar e receber mensagens do WhatsApp usando a Evolution API.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="w-5 h-5 text-primary" />
                    <h3 className="font-medium">Múltiplas Instâncias</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Gerencie múltiplas conexões de WhatsApp com diferentes números.
                  </p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="w-5 h-5 text-primary" />
                    <h3 className="font-medium">Reconexão Automática</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sistema se reconecta automaticamente em caso de desconexão.
                  </p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={loadSettings}
              >
                Recarregar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiEvolution;
