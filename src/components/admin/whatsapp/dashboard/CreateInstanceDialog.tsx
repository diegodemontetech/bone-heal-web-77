
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateInstanceDialogProps {
  isOpen: boolean;
  isCreating: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateInstance: (name: string) => Promise<any>;
}

const CreateInstanceDialog = ({
  isOpen,
  isCreating,
  onOpenChange,
  onCreateInstance,
}: CreateInstanceDialogProps) => {
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

        <div className="py-4">
          <Input
            placeholder="Nome da Instância"
            value={newInstanceName}
            onChange={(e) => setNewInstanceName(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateInstance}
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInstanceDialog;
