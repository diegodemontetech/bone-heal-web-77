
import { useState } from 'react';
import { WhatsAppDialogState } from './WhatsAppTypes';

export const useWhatsAppDialog = (): WhatsAppDialogState => {
  const [isOpen, setIsOpen] = useState(false);
  
  return {
    isOpen,
    setIsOpen
  };
};
