
import { supabase } from '@/integrations/supabase/client';
import { WhatsAppInstance } from '@/components/admin/whatsapp/types';
import { useWhatsAppInstances } from './useWhatsAppInstances';
import { toast } from 'sonner';

export const useWhatsAppInstanceActions = () => {
  const { 
    fetchInstances, 
    createInstance, 
    refreshQrCode,
    isCreating
  } = useWhatsAppInstances();

  const handleCreateInstance = async (newInstanceName: string): Promise<boolean> => {
    if (!newInstanceName.trim()) {
      return false;
    }
    
    const instance = await createInstance(newInstanceName);
    return !!instance;
  };

  const handleDeleteInstance = async (instanceId: string): Promise<boolean> => {
    if (window.confirm("Tem certeza que deseja excluir esta instância?")) {
      try {
        const { error } = await supabase
          .from('whatsapp_instances')
          .delete()
          .eq('id', instanceId);
          
        if (error) throw error;
        
        // Atualizar instâncias após exclusão
        await fetchInstances();
        toast.success("Instância excluída com sucesso");
        return true;
      } catch (error) {
        console.error("Erro ao excluir instância:", error);
        toast.error("Falha ao excluir instância");
        return false;
      }
    }
    return false;
  };

  const handleRefreshQr = async (instanceId: string): Promise<any> => {
    try {
      const result = await refreshQrCode(instanceId);
      return result;
    } catch (error) {
      console.error("Erro ao atualizar QR Code:", error);
      toast.error("Falha ao atualizar QR Code");
      return false;
    }
  };

  return {
    handleCreateInstance,
    handleDeleteInstance,
    handleRefreshQr,
    isCreating
  };
};
