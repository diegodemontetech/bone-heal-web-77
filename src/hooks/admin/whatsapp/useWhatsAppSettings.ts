
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWhatsAppSettings = () => {
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

  useEffect(() => {
    const webhookBaseUrl = window.location.origin.includes('localhost') 
      ? 'http://localhost:54321/functions/v1'
      : `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1`;
    
    setWebhookUrl(`${webhookBaseUrl}/webhook-whatsapp`);
    fetchSecrets();
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
  
  const createInstance = async () => {
    setQrCodeLoading(true);
    try {
      if (!evolutionUrl || !evolutionKey) {
        toast.error('Configure a URL e a chave da API Evolution primeiro');
        return;
      }

      const { data, error } = await supabase.functions.invoke('evolution-api', {
        body: { 
          action: 'getInstance',
          instanceName: instanceName
        }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success('Instância criada com sucesso. Gere o QR Code para conectar.');
      } else {
        toast.error(data?.message || 'Erro ao criar instância');
      }
    } catch (error: any) {
      console.error('Erro ao criar instância:', error);
      toast.error('Erro ao criar instância: ' + error.message);
    } finally {
      setQrCodeLoading(false);
    }
  };
  
  const generateQRCode = async () => {
    setQrCodeLoading(true);
    setQrCodeData('');
    try {
      if (!evolutionUrl || !evolutionKey) {
        toast.error('Configure a URL e a chave da API Evolution primeiro');
        return;
      }

      const { data, error } = await supabase.functions.invoke('evolution-api', {
        body: { 
          action: 'getQRCode',
          instanceName: instanceName
        }
      });
      
      if (error) throw error;
      
      if (data?.success && data?.qrcode) {
        setQrCodeData(data.qrcode);
      } else {
        toast.error(data?.message || 'Erro ao gerar QR Code');
      }
    } catch (error: any) {
      console.error('Erro ao gerar QR Code:', error);
      toast.error('Erro ao gerar QR Code: ' + error.message);
    } finally {
      setQrCodeLoading(false);
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
    checkConnectionStatus
  };
};
