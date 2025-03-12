
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { InstanceNameInput } from "./InstanceNameInput";
import { DialogActions } from "./DialogActions";

export interface CreateInstanceDialogProps {
  isOpen: boolean;
  isCreating: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateInstance: (name: string) => Promise<any>;
}

export const CreateInstanceDialog: React.FC<CreateInstanceDialogProps> = ({
  isOpen,
  isCreating,
  onOpenChange,
  onCreateInstance,
}) => {
  const [newInstanceName, setNewInstanceName] = useState("");

  const handleCreateInstance = async () => {
    if (!newInstanceName.trim()) return;
    const success = await onCreateInstance(newInstanceName);
    if (success) {
      setNewInstanceName("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Instância WhatsApp</DialogTitle>
          <DialogDescription>
            Insira um nome para identificar sua nova instância WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <InstanceNameInput
          value={newInstanceName}
          onChange={setNewInstanceName}
        />

        <DialogFooter>
          <DialogActions
            onCancel={() => onOpenChange(false)}
            onConfirm={handleCreateInstance}
            isLoading={isCreating}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
