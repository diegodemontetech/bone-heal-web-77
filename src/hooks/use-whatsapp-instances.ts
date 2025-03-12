
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

      // Mapeando para ter o tipo correto
      const instancesWithName = data.map(instance => ({
        ...instance,
        name: instance.instance_name // Adicionando o campo name a partir de instance_name
      })) as WhatsAppInstance[];

      setInstances(instancesWithName);
    } catch (err) {
      console.error('Erro ao buscar instâncias WhatsApp:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      toast.error('Falha ao carregar instâncias WhatsApp');
    } finally {
      setIsLoading(false);
    }
  };

  const createInstance = async (instanceName: string) => {
    if (!instanceName.trim()) {
      toast.error('Nome da instância não pode ser vazio');
      return null;
    }

    setIsCreating(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('whatsapp_instances')
        .insert([
          {
            instance_name: instanceName,
            status: 'disconnected',
            user_id: userData.user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Adiciona o nome para compatibilidade
      const instanceWithName = {
        ...data,
        name: data.instance_name
      } as WhatsAppInstance;

      setInstances(prev => [instanceWithName, ...prev]);
      toast.success('Instância WhatsApp criada com sucesso!');
      
      return instanceWithName;
    } catch (err) {
      console.error('Erro ao criar instância WhatsApp:', err);
      toast.error('Falha ao criar instância WhatsApp');
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const refreshQrCode = async (instanceId: string) => {
    try {
      // Implementação para atualizar o QR code
      const response = await fetch(`/api/whatsapp/refresh-qr?instanceId=${instanceId}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar QR code');
      }
      
      const data = await response.json();
      
      // Atualiza o QR code localmente
      setInstances(prev => 
        prev.map(instance => 
          instance.id === instanceId 
            ? { ...instance, qr_code: data.qrCode } 
            : instance
        )
      );
      
      return data.qrCode;
    } catch (err) {
      console.error('Erro ao atualizar QR code:', err);
      toast.error('Falha ao atualizar QR code');
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
