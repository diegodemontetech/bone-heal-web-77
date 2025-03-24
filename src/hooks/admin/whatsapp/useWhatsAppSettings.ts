
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { WhatsAppInstance } from '@/components/admin/whatsapp/types';
import { useAuth } from '@/hooks/use-auth';

export const useWhatsAppSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  
  const [evolutionUrl, setEvolutionUrl] = useState('');
  const [evolutionKey, setEvolutionKey] = useState('');
  const [zapiInstanceId, setZapiInstanceId] = useState('');
  const [zapiToken, setZapiToken] = useState('');
  const [instanceName, setInstanceName] = useState('default');
  
  const [webhookUrl, setWebhookUrl] = useState('');
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [instancesLoading, setInstancesLoading] = useState(true);

  useEffect(() => {
    const webhookBaseUrl = window.location.origin.includes('localhost') 
      ? 'http://localhost:54321/functions/v1'
      : `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1`;
    
    setWebhookUrl(`${webhookBaseUrl}/webhook-whatsapp`);
    fetchSecrets();
    fetchInstances();
  }, []);

  const fetchSecrets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: { getConfig: true }
      });
      
      if (error) throw error;
      
      if (data?.config) {
        setEvolutionUrl(data.config.evolutionApiUrl || '');
        setEvolutionKey(data.config.evolutionApiKey || '');
        setZapiInstanceId(data.config.zApiInstanceId || '');
        setZapiToken(data.config.zApiToken || '');
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchInstances = async () => {
    if (!user) return;
    
    setInstancesLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setInstances(data || []);
    } catch (error) {
      console.error('Erro ao buscar instâncias:', error);
      toast.error('Erro ao carregar instâncias');
    } finally {
      setInstancesLoading(false);
    }
  };
  
  const saveSecrets = async () => {
    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-secret', {
        body: { 
          secrets: {
            'EVOLUTION_API_URL': evolutionUrl,
            'EVOLUTION_API_KEY': evolutionKey,
            'ZAPI_INSTANCE_ID': zapiInstanceId,
            'ZAPI_TOKEN': zapiToken
          }
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
    setTimeout(() => setCopied(false), 2000);
  };
  
  const createInstance = async (newInstanceName: string) => {
    setQrCodeLoading(true);
    try {
      if (!evolutionUrl || !evolutionKey) {
        toast.error('Configure a URL e a chave da API Evolution primeiro');
        return null;
      }

      // Verificar se já tem 5 instâncias
      if (instances.length >= 5) {
        toast.error('Você já atingiu o limite de 5 instâncias');
        return null;
      }

      // Primeiro criar a instância no banco de dados
      const { data: instanceData, error: instanceError } = await supabase
        .from('whatsapp_instances')
        .insert([{
          instance_name: newInstanceName,
          user_id: user?.id,
          status: 'pending'
        }])
        .select()
        .single();
      
      if (instanceError) throw instanceError;
      
      // Agora criar a instância na API Evolution
      const { data, error } = await supabase.functions.invoke('evolution-api', {
        body: { 
          action: 'getInstance',
          instanceName: newInstanceName
        }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        // Gerar QR Code automaticamente
        await generateQRCodeForInstance(newInstanceName);
        
        // Atualizar a lista de instâncias
        await fetchInstances();
        
        toast.success('Instância criada com sucesso. Escaneie o QR Code para conectar.');
        return instanceData;
      } else {
        // Se falhar, remover a instância do banco
        if (instanceData?.id) {
          await supabase
            .from('whatsapp_instances')
            .delete()
            .eq('id', instanceData.id);
        }
        
        throw new Error(data?.message || 'Erro ao criar instância');
      }
    } catch (error: any) {
      console.error('Erro ao criar instância:', error);
      toast.error('Erro ao criar instância: ' + error.message);
      return null;
    } finally {
      setQrCodeLoading(false);
    }
  };
  
  const generateQRCode = async () => {
    setQrCodeLoading(true);
    setQrCodeData('');
    try {
      await generateQRCodeForInstance(instanceName);
    } catch (error: any) {
      console.error('Erro ao gerar QR Code:', error);
      toast.error('Erro ao gerar QR Code: ' + error.message);
    } finally {
      setQrCodeLoading(false);
    }
  };
  
  const generateQRCodeForInstance = async (instanceNameToUse: string) => {
    try {
      if (!evolutionUrl || !evolutionKey) {
        toast.error('Configure a URL e a chave da API Evolution primeiro');
        return null;
      }

      const { data, error } = await supabase.functions.invoke('evolution-api', {
        body: { 
          action: 'getQRCode',
          instanceName: instanceNameToUse
        }
      });
      
      if (error) throw error;
      
      if (data?.success && data?.qrcode) {
        if (instanceNameToUse === instanceName) {
          setQrCodeData(data.qrcode);
        }
        return data.qrcode;
      } else {
        toast.error(data?.message || 'Erro ao gerar QR Code');
        return null;
      }
    } catch (error: any) {
      console.error('Erro ao gerar QR Code:', error);
      throw error;
    }
  };
  
  const refreshQrCode = async (instanceId: string) => {
    try {
      // Buscar o nome da instância
      const instance = instances.find(i => i.id === instanceId);
      if (!instance) {
        toast.error('Instância não encontrada');
        return null;
      }
      
      return await generateQRCodeForInstance(instance.instance_name);
    } catch (error: any) {
      console.error('Erro ao atualizar QR Code:', error);
      toast.error('Erro ao atualizar QR Code: ' + error.message);
      return null;
    }
  };
  
  const deleteInstance = async (instanceId: string) => {
    try {
      // Buscar o nome da instância
      const instance = instances.find(i => i.id === instanceId);
      if (!instance) {
        toast.error('Instância não encontrada');
        return false;
      }
      
      // Deletar a instância na API Evolution
      await supabase.functions.invoke('evolution-api', {
        body: { 
          action: 'deleteInstance',
          instanceName: instance.instance_name
        }
      });
      
      // Deletar a instância no banco de dados
      const { error } = await supabase
        .from('whatsapp_instances')
        .delete()
        .eq('id', instanceId);
      
      if (error) throw error;
      
      // Atualizar a lista de instâncias
      await fetchInstances();
      
      toast.success('Instância excluída com sucesso');
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir instância:', error);
      toast.error('Erro ao excluir instância: ' + error.message);
      return false;
    }
  };
  
  const checkConnectionStatus = async () => {
    try {
      if (!evolutionUrl || !evolutionKey) {
        toast.error('Configure a URL e a chave da API Evolution primeiro');
        return;
      }

      const { data, error } = await supabase.functions.invoke('evolution-api', {
        body: { 
          action: 'getConnectionStatus',
          instanceName: instanceName
        }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success(`Status da conexão: ${data.status}`);
      } else {
        toast.error(data?.message || 'Erro ao verificar status');
      }
    } catch (error: any) {
      console.error('Erro ao verificar status:', error);
      toast.error('Erro ao verificar status: ' + error.message);
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
