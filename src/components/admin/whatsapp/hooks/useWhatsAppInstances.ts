
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WhatsAppInstance } from '@/types/automation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

export const useWhatsAppInstances = () => {
  const { user } = useAuth();
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchInstances = async () => {
    if (!user) {
      setInstances([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Transformar os dados para corresponder ao tipo WhatsAppInstance
      const formattedInstances: WhatsAppInstance[] = data.map(instance => ({
        id: instance.id,
        name: instance.instance_name,
        instance_name: instance.instance_name,
        status: instance.status,
        qr_code: instance.qr_code || '',
        user_id: instance.user_id,
        created_at: instance.created_at,
        updated_at: instance.updated_at
      }));

      setInstances(formattedInstances);
    } catch (err) {
      console.error('Erro ao buscar instâncias:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error('Erro ao carregar instâncias do WhatsApp');
    } finally {
      setIsLoading(false);
    }
  };

  const createInstance = async (instanceName: string) => {
    if (!user) {
      toast.error('Você precisa estar logado para criar uma instância');
      return null;
    }

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .insert({
          instance_name: instanceName,
          user_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Solicitar geração de QR Code
      await supabase.functions.invoke('evolution-api', {
        body: {
          action: 'create_instance',
          instance_name: instanceName,
          instance_id: data.id
        }
      });

      // Formatar para corresponder ao tipo WhatsAppInstance
      const newInstance: WhatsAppInstance = {
        id: data.id,
        name: data.instance_name,
        instance_name: data.instance_name,
        status: data.status,
        qr_code: data.qr_code || '',
        user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setInstances(prev => [newInstance, ...prev]);
      toast.success('Instância criada com sucesso');
      return newInstance;
    } catch (err) {
      console.error('Erro ao criar instância:', err);
      toast.error('Erro ao criar instância do WhatsApp');
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const refreshQrCode = async (instanceId: string) => {
    try {
      // Solicitar novo QR Code
      await supabase.functions.invoke('evolution-api', {
        body: {
          action: 'refresh_qr',
          instance_id: instanceId
        }
      });

      toast.success('Solicitação de novo QR Code enviada');
      
      // Aguardar um pouco e buscar os dados atualizados
      setTimeout(() => {
        fetchInstances();
      }, 3000);
      
      return true;
    } catch (err) {
      console.error('Erro ao atualizar QR Code:', err);
      toast.error('Erro ao atualizar QR Code');
      return false;
    }
  };

  useEffect(() => {
    fetchInstances();
  }, [user]);

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
