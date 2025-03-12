
import React from "react";
import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export const DialogActions: React.FC<DialogActionsProps> = ({
  onCancel,
  onConfirm,
  isSubmitting = false,
  confirmText = "Confirmar",
  cancelText = "Cancelar"
}) => {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
        {cancelText}
      </Button>
      <Button onClick={onConfirm} disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="animate-spin mr-2">⌛</span>
            Processando...
          </>
        ) : (
          confirmText
        )}
      </Button>
    </div>
  );
};
