
import { useState } from 'react';
import { WhatsAppTabsState } from './WhatsAppTypes';

export const useWhatsAppTabs = (): WhatsAppTabsState => {
  const [activeTab, setActiveTab] = useState("instances");
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);

  const selectInstance = (id: string) => {
    setSelectedInstanceId(id);
    setActiveTab("chat");
  };

  return {
    activeTab,
    setActiveTab,
    selectedInstanceId,
    setSelectedInstanceId,
    selectInstance
  };
};
