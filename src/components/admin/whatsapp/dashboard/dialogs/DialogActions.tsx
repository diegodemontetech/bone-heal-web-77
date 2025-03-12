
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DialogActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  confirmText?: string;
  cancelText?: string;
}

export const DialogActions: React.FC<DialogActionsProps> = ({
  onCancel,
  onConfirm,
  isLoading,
  confirmText = "Criar",
  cancelText = "Cancelar"
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        {cancelText}
      </Button>
      <Button 
        onClick={onConfirm}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          confirmText
        )}
      </Button>
    </div>
  );
};
