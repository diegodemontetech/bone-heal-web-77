
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { InstanceNameInput } from "./InstanceNameInput";
import { DialogActions } from "./DialogActions";
import { WhatsAppInstance } from "@/components/admin/whatsapp/types";

interface CreateInstanceDialogProps {
  isOpen: boolean;
  isCreating: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  onCreateInstance: (instanceName: string) => Promise<WhatsAppInstance | null>;
}

export const CreateInstanceDialog = ({
  isOpen,
  isCreating,
  onClose,
  onOpenChange,
  onCreateInstance
}: CreateInstanceDialogProps) => {
  const [instanceName, setInstanceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateInstance = async () => {
    if (!instanceName.trim()) {
      toast.error("Por favor, insira um nome para a instância");
      return;
    }

    setIsLoading(true);
    try {
      const result = await onCreateInstance(instanceName);
      if (result) {
        toast.success("Instância criada com sucesso");
        setInstanceName("");
        onClose();
      }
    } catch (error) {
      console.error("Erro ao criar instância:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setInstanceName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Instância do WhatsApp</DialogTitle>
          <DialogDescription>
            Crie uma nova instância para conectar um número do WhatsApp
          </DialogDescription>
        </DialogHeader>

        <InstanceNameInput
          value={instanceName}
          onChange={setInstanceName}
          disabled={isLoading}
        />

        <DialogActions
          onCancel={handleCancel}
          onConfirm={handleCreateInstance}
          isCreating={isCreating}
          isLoading={isLoading}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
