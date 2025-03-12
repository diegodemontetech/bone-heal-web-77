
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WhatsAppInstance } from '@/types/automation';

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

      if (error) {
        throw error;
      }

      setInstances(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro desconhecido ao buscar instâncias'));
    } finally {
      setIsLoading(false);
    }
  };

  const createInstance = async (name: string): Promise<WhatsAppInstance> => {
    setIsCreating(true);
    try {
      const instanceName = `instance_${Date.now()}`;
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .insert([{
          name,
          instance_name: instanceName,
          status: 'disconnected'
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Refreshing the list
      fetchInstances();
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao criar instância');
    } finally {
      setIsCreating(false);
    }
  };

  const refreshQrCode = async (instanceId: string): Promise<string> => {
    try {
      // Call Edge Function to refresh QR code
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evolution-api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'qrcode',
          instanceId
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar QR Code');
      }

      const data = await response.json();
      return data.qrcode || '';
    } catch (error) {
      console.error('Erro ao atualizar QR Code:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);

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
