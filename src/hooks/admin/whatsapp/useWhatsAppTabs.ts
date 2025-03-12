
import { useState } from 'react';
import { WhatsAppTabsState } from './WhatsAppTypes';

export const useWhatsAppTabs = (): WhatsAppTabsState => {
  const [activeTab, setActiveTab] = useState("instances");
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);

  return {
    activeTab,
    setActiveTab,
    selectedInstanceId,
    setSelectedInstanceId
  };
};
