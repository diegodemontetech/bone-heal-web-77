
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateInstanceDialogProps } from "@/components/admin/whatsapp/types";
import { InstanceNameInput } from "./InstanceNameInput";
import { DialogActions } from "./DialogActions";

export const CreateInstanceDialog: React.FC<CreateInstanceDialogProps> = ({
  isOpen,
  isCreating,
  onOpenChange,
  onCreateInstance
}) => {
  const [instanceName, setInstanceName] = useState("");
  
  const handleConfirm = async () => {
    await onCreateInstance(instanceName);
    setInstanceName("");
  };
  
  const handleCancel = () => {
    setInstanceName("");
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Instância WhatsApp</DialogTitle>
          <DialogDescription>
            Crie uma nova instância para conectar com o WhatsApp
          </DialogDescription>
        </DialogHeader>
        
        <InstanceNameInput 
          value={instanceName} 
          onChange={setInstanceName} 
        />
        
        <DialogActions 
          onCancel={handleCancel} 
          onConfirm={handleConfirm}
          isLoading={isCreating}
        />
      </DialogContent>
    </Dialog>
  );
};
