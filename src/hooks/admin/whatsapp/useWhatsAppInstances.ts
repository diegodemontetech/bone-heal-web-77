
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WhatsAppInstance } from '@/components/admin/whatsapp/types';
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedInstances: WhatsAppInstance[] = data.map(instance => ({
        id: instance.id,
        name: instance.instance_name, // Nome é igual ao instance_name para compatibilidade
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
      toast.error("Erro ao carregar instâncias do WhatsApp");
    } finally {
      setIsLoading(false);
    }
  };

  const createInstance = async (instanceName: string): Promise<WhatsAppInstance | null> => {
    if (!user) {
      toast.error("Você precisa estar logado para criar uma instância");
      return null;
    }

    // Verificar limite de 5 instâncias
    if (instances.length >= 5) {
      toast.error("Você já atingiu o limite de 5 instâncias");
      return null;
    }

    setIsCreating(true);
    try {
      const newInstance = {
        instance_name: instanceName,
        user_id: user.id,
        status: 'pending',
        name: instanceName // Nome é igual ao instance_name para compatibilidade
      };

      const { data, error } = await supabase
        .from('whatsapp_instances')
        .insert(newInstance)
        .select()
        .single();

      if (error) throw error;

      // Formatar para corresponder ao tipo WhatsAppInstance
      const instance: WhatsAppInstance = {
        id: data.id,
        name: data.instance_name,
        instance_name: data.instance_name,
        status: data.status,
        qr_code: data.qr_code || '',
        user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setInstances(prev => [instance, ...prev]);
      toast.success("Instância criada com sucesso");
      return instance;
    } catch (err) {
      console.error("Erro ao criar instância:", err);
      toast.error("Erro ao criar instância do WhatsApp");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const refreshQrCode = async (instanceId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('evolution-api', {
        body: {
          action: 'refresh_qr',
          instance_id: instanceId
        }
      });

      if (error) throw error;
      
      if (!data?.success) {
        throw new Error(data?.message || "Erro ao gerar QR code");
      }

      // Atualizar a lista de instâncias localmente
      if (data.qrcode) {
        setInstances(prev => prev.map(instance => 
          instance.id === instanceId ? 
          { 
            ...instance, 
            qr_code: data.qrcode,
            status: 'awaiting_connection'
          } : 
          instance
        ));
      }
      
      toast.success("QR Code gerado com sucesso");
      return data.qrcode || null;
    } catch (err) {
      console.error("Erro ao atualizar QR Code:", err);
      toast.error("Erro ao atualizar QR Code");
      return null;
    }
  };

  const deleteInstance = async (instanceId: string): Promise<boolean> => {
    try {
      // Buscar a instância antes de excluir
      const instanceToDelete = instances.find(i => i.id === instanceId);
      if (!instanceToDelete) {
        toast.error("Instância não encontrada");
        return false;
      }

      // Excluir a instância na API Evolution
      const { data: evolutionData, error: evolutionError } = await supabase.functions.invoke('evolution-api', {
        body: {
          action: 'deleteInstance',
          instanceName: instanceToDelete.instance_name
        }
      });

      // Mesmo se houver erro na Evolution API, continuamos para excluir do banco
      if (evolutionError) {
        console.error("Erro ao excluir instância na Evolution API:", evolutionError);
      }

      // Excluir do banco de dados
      const { error } = await supabase
        .from('whatsapp_instances')
        .delete()
        .eq('id', instanceId);

      if (error) throw error;

      // Atualizar lista local
      setInstances(prev => prev.filter(instance => instance.id !== instanceId));
      toast.success("Instância excluída com sucesso");
      return true;
    } catch (err) {
      console.error("Erro ao excluir instância:", err);
      toast.error("Erro ao excluir instância");
      return false;
    }
  };

  // Carregar instâncias quando o usuário mudar
  useEffect(() => {
    if (user) {
      fetchInstances();
    } else {
      setInstances([]);
      setIsLoading(false);
    }
  }, [user]);

  return {
    instances,
    isLoading,
    error,
    fetchInstances,
    createInstance,
    refreshQrCode,
    deleteInstance,
    isCreating
  };
};
