
import { useState } from 'react';

export const useWhatsAppTabs = () => {
  const [activeTab, setActiveTab] = useState("instances");
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  
  const selectInstance = (instanceId: string) => {
    setSelectedInstanceId(instanceId);
    setActiveTab("chat");
  };
  
  const resetSelection = () => {
    setSelectedInstanceId(null);
    setActiveTab("instances");
  };
  
  return {
    activeTab,
    setActiveTab,
    selectedInstanceId,
    setSelectedInstanceId,
    selectInstance,
    resetSelection
  };
};
