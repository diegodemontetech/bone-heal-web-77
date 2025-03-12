
import { useState } from 'react';

export const useWhatsAppDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const toggleDialog = () => setIsDialogOpen(prev => !prev);
  
  return {
    isDialogOpen,
    setIsDialogOpen,
    openDialog,
    closeDialog,
    toggleDialog
  };
};
