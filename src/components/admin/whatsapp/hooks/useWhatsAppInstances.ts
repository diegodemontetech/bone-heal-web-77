
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WhatsAppInstance {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

export const useWhatsAppInstances = () => {
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchInstances = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .select('*')
        .order('name');

      if (error) throw error;
      setInstances(data || []);
    } catch (err) {
      console.error('Erro ao buscar instâncias WhatsApp:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error('Falha ao carregar instâncias do WhatsApp');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  return {
    instances,
    isLoading,
    error,
    fetchInstances
  };
};
