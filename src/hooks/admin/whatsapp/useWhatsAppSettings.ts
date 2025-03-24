
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "sonner";
import { WhatsAppInstance } from "@/components/admin/whatsapp/types";

export const useWhatsAppSettings = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const [evolutionUrl, setEvolutionUrl] = useState("");
  const [evolutionKey, setEvolutionKey] = useState("");
  const [zapiInstanceId, setZapiInstanceId] = useState("");
  const [zapiToken, setZapiToken] = useState("");
  const [instanceName, setInstanceName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [instancesLoading, setInstancesLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchSettings();
      fetchInstances();
      
      // Definir o webhook URL
      const baseUrl = window.location.origin;
      setWebhookUrl(`${baseUrl}/api/webhook/whatsapp`);
    }
  }, [profile]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('check-whatsapp-config');
      
      if (error) {
        console.error('Erro ao verificar configuração:', error);
        return;
      }
      
      if (data) {
        setEvolutionUrl(data.evolutionUrl || '');
        setEvolutionKey(data.evolutionKey || '');
        setZapiInstanceId(data.zapiInstanceId || '');
        setZapiToken(data.zapiToken || '');
      }
    } catch (error) {
      console.error('Erro ao verificar configuração:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchInstances = async () => {
    if (!profile?.id) return;
    
    try {
      setInstancesLoading(true);
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .select('*')
        .eq('user_id', profile.id);
        
      if (error) throw error;
      
      // Mapear para o formato esperado
      const mappedInstances: WhatsAppInstance[] = (data || []).map(instance => ({
        ...instance,
        name: instance.instance_name // Usando instance_name como propriedade name
      }));
      
      setInstances(mappedInstances);
    } catch (error) {
      console.error('Erro ao buscar instâncias:', error);
    } finally {
      setInstancesLoading(false);
    }
  };

  const saveSecrets = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase.functions.invoke('save-whatsapp-config', {
        body: {
          evolutionUrl,
          evolutionKey,
          zapiInstanceId,
          zapiToken
        }
      });
      
      if (error) throw error;
      
      toast.success('Configurações salvas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  
  // Função para criar uma nova instância
  const createInstance = async (newInstanceName: string) => {
    if (!profile?.id) {
      toast.error('Você precisa estar logado para criar uma instância');
      return null;
    }
    
    try {
      setSaving(true);
      
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .insert({
          user_id: profile.id,
          instance_name: newInstanceName,
          status: 'disconnected'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Instância criada com sucesso');
      await fetchInstances();
      
      return data;
    } catch (error: any) {
      console.error('Erro ao criar instância:', error);
      toast.error(`Erro ao criar instância: ${error.message}`);
      return null;
    } finally {
      setSaving(false);
    }
  };
  
  // Gera QR Code para conectar o WhatsApp
  const generateQRCode = async () => {
    try {
      setQrCodeLoading(true);
      
      const { data, error } = await supabase.functions.invoke('generate-qrcode');
      
      if (error) throw error;
      
      if (data?.qrcode) {
        setQrCodeData(data.qrcode);
      } else {
        toast.error('Não foi possível gerar o QR Code');
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast.error('Erro ao gerar QR Code');
    } finally {
      setQrCodeLoading(false);
    }
  };
  
  // Verifica o status da conexão
  const checkConnectionStatus = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('check-connection');
      
      if (error) throw error;
      
      if (data?.status === 'connected') {
        toast.success('WhatsApp conectado com sucesso!');
      } else {
        toast.info('WhatsApp não está conectado. Escaneie o QR Code para conectar.');
      }
      
      return data?.status;
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
      toast.error('Erro ao verificar conexão');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Atualiza o QR Code para uma instância específica
  const refreshQrCode = async (instanceId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('refresh-qrcode', {
        body: { instanceId }
      });
      
      if (error) throw error;
      
      await fetchInstances();
      
      if (data?.success) {
        toast.success('QR Code atualizado com sucesso');
      } else {
        toast.error('Erro ao atualizar QR Code');
      }
    } catch (error) {
      console.error('Erro ao atualizar QR Code:', error);
      toast.error('Erro ao atualizar QR Code');
    }
  };
  
  // Exclui uma instância
  const deleteInstance = async (instanceId: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_instances')
        .delete()
        .eq('id', instanceId);
        
      if (error) throw error;
      
      toast.success('Instância excluída com sucesso');
      await fetchInstances();
    } catch (error) {
      console.error('Erro ao excluir instância:', error);
      toast.error('Erro ao excluir instância');
    }
  };

  return {
    loading,
    saving,
    copied,
    qrCodeData,
    qrCodeLoading,
    evolutionUrl,
    evolutionKey,
    zapiInstanceId,
    zapiToken,
    instanceName,
    webhookUrl,
    setEvolutionUrl,
    setEvolutionKey,
    setZapiInstanceId,
    setZapiToken,
    setInstanceName,
    saveSecrets,
    copyToClipboard,
    createInstance,
    generateQRCode,
    checkConnectionStatus,
    instances,
    instancesLoading,
    refreshQrCode,
    deleteInstance
  };
};
