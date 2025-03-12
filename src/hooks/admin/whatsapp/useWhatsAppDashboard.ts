
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWhatsAppInstances } from "./useWhatsAppInstances";
import { useWhatsAppMessages } from "./useWhatsAppMessages";
import { WhatsAppInstance, WhatsAppMessage } from "@/components/admin/whatsapp/types";

export const useWhatsAppDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("instances");
  const [userId, setUserId] = useState<string | null>(null);
  
  const { 
    instances, 
    isLoading, 
    error, 
    fetchInstances, 
    createInstance, 
    refreshQrCode,
    isCreating
  } = useWhatsAppInstances();
  
  const { 
    messages, 
    loading: messagesLoading, 
    sendMessage 
  } = useWhatsAppMessages(selectedInstanceId);

  // Fetch instances on component mount
  useEffect(() => {
    fetchInstances();
    
    // Get current user ID
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    
    getCurrentUser();
  }, []);

  const handleCreateInstance = async (newInstanceName: string): Promise<boolean> => {
    if (!newInstanceName.trim()) {
      return false;
    }
    
    const instance = await createInstance(newInstanceName);
    
    if (instance) {
      setIsDialogOpen(false);
      setSelectedInstanceId(instance.id);
      setActiveTab("chat");
      return true;
    }
    
    return false;
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
        
        // Se a instância excluída for a selecionada, resetar a seleção
        if (selectedInstanceId === instanceId) {
          setSelectedInstanceId(null);
          setActiveTab("instances");
        }
        
        return true;
      } catch (error) {
        console.error("Erro ao excluir instância:", error);
        return false;
      }
    }
    return false;
  };

  const handleSelectInstance = (instanceId: string): void => {
    setSelectedInstanceId(instanceId);
    setActiveTab("chat");
  };

  const handleSendMessage = async (message: string): Promise<boolean> => {
    if (!selectedInstanceId || !message.trim()) return false;
    
    try {
      const success = await sendMessage(message);
      return success;
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      return false;
    }
  };

  const handleRefreshQr = async (instanceId: string): Promise<any> => {
    return await refreshQrCode(instanceId);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    selectedInstanceId,
    activeTab,
    setActiveTab,
    instances,
    isLoading,
    error,
    messages,
    messagesLoading,
    isCreating,
    handleCreateInstance,
    handleDeleteInstance,
    handleSelectInstance,
    handleSendMessage,
    handleRefreshQr
  };
};
