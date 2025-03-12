
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { WhatsAppInstance } from '@/components/admin/whatsapp/types';

export const useWhatsAppInstances = () => {
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchInstances = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setInstances(data || []);
    } catch (err) {
      console.error('Erro ao buscar instâncias:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      toast.error('Falha ao carregar instâncias');
    } finally {
      setIsLoading(false);
    }
  };

  const createInstance = async (instanceName: string): Promise<WhatsAppInstance | null> => {
    if (!instanceName.trim()) return null;
    
    setIsCreating(true);
    try {
      // 1. Verificar se já existe uma instância com esse nome
      const { data: existingInstances, error: checkError } = await supabase
        .from('whatsapp_instances')
        .select('id')
        .eq('instance_name', instanceName)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingInstances) {
        toast.error('Já existe uma instância com esse nome');
        return null;
      }
      
      // 2. Criar a instância na Evolution API
      const { data: evolutionData, error: evolutionError } = await supabase.functions.invoke('evolution-api', {
        body: { 
          action: 'getInstance',
          instanceName: instanceName
        }
      });
      
      if (evolutionError) throw evolutionError;
      
      if (!evolutionData?.success) {
        toast.error(evolutionData?.message || 'Erro ao criar instância na API');
        return null;
      }
      
      // 3. Criar a instância no banco de dados
      const newInstance: Partial<WhatsAppInstance> = {
        instance_name: instanceName,
        name: instanceName, // Para compatibilidade
        status: 'disconnected',
        qr_code: ''
      };
      
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .insert([newInstance])
        .select()
        .single();
        
      if (error) throw error;
      
      // 4. Adicionar a nova instância ao estado local
      setInstances(prev => [data, ...prev]);
      
      toast.success('Instância criada com sucesso');
      return data;
    } catch (err) {
      console.error('Erro ao criar instância:', err);
      toast.error('Falha ao criar instância');
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const refreshQrCode = async (instanceId: string): Promise<any> => {
    try {
      // Buscar o nome da instância
      const instance = instances.find(inst => inst.id === instanceId);
      if (!instance) {
        toast.error('Instância não encontrada');
        return null;
      }
      
      // Gerar QR Code na Evolution API
      const { data, error } = await supabase.functions.invoke('evolution-api', {
        body: { 
          action: 'getQRCode',
          instanceName: instance.instance_name
        }
      });
      
      if (error) throw error;
      
      if (!data?.success) {
        toast.error(data?.message || 'Erro ao gerar QR Code');
        return null;
      }
      
      // Atualizar QR code no banco de dados
      if (data.qrcode) {
        const { error: updateError } = await supabase
          .from('whatsapp_instances')
          .update({ qr_code: data.qrcode })
          .eq('id', instanceId);
          
        if (updateError) throw updateError;
        
        // Atualizar instância localmente
        setInstances(prev => 
          prev.map(inst => 
            inst.id === instanceId 
              ? { ...inst, qr_code: data.qrcode } 
              : inst
          )
        );
      }
      
      return data;
    } catch (err) {
      console.error('Erro ao atualizar QR Code:', err);
      toast.error('Falha ao atualizar QR Code');
      return null;
    }
  };

  return {
    instances,
    isLoading,
    error,
    fetchInstances,
    createInstance,
    refreshQrCode,
    isCreating
  };
};
