
import { useState } from 'react';
import { WhatsAppDialogState } from './WhatsAppTypes';

export const useWhatsAppDialog = (): WhatsAppDialogState => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return {
    isOpen: isDialogOpen,
    setIsOpen: setIsDialogOpen
  };
};
