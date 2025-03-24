
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface DialogActionsProps {
  isCreating: boolean;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export const DialogActions = ({ isCreating, onCancel, onConfirm, isLoading }: DialogActionsProps) => {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button variant="outline" onClick={onCancel} disabled={isLoading}>
        Cancelar
      </Button>
      <Button onClick={onConfirm} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isCreating ? "Criando..." : "Salvando..."}
          </>
        ) : (
          isCreating ? "Criar Instância" : "Salvar"
        )}
      </Button>
    </div>
  );
};
