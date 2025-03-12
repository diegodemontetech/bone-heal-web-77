
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InstanceNameInput } from "./InstanceNameInput";
import { DialogActions } from "./DialogActions";

interface CreateInstanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (instanceName: string) => Promise<boolean>;
  isCreating: boolean;
}

export const CreateInstanceDialog: React.FC<CreateInstanceDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isCreating
}) => {
  const [instanceName, setInstanceName] = useState("");

  const handleConfirm = async () => {
    const success = await onConfirm(instanceName);
    if (success) {
      setInstanceName("");
    }
  };

  const handleClose = () => {
    setInstanceName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Instância WhatsApp</DialogTitle>
        </DialogHeader>
        
        <InstanceNameInput
          value={instanceName}
          onChange={setInstanceName}
        />
        
        <DialogActions
          onCancel={handleClose}
          onConfirm={handleConfirm}
          isSubmitting={isCreating}
          confirmText="Criar Instância"
        />
      </DialogContent>
    </Dialog>
  );
};
