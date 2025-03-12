
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogActionsProps } from "@/components/admin/whatsapp/types";
import { Loader2 } from "lucide-react";

export const DialogActions: React.FC<DialogActionsProps> = ({ 
  onCancel, 
  onConfirm, 
  isLoading 
}) => {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancelar
      </Button>
      <Button
        type="button"
        onClick={onConfirm}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando...
          </>
        ) : (
          'Criar'
        )}
      </Button>
    </div>
  );
};
