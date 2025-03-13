
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

interface FormActionsProps {
  isSubmitting: boolean;
  onClose?: () => void;
  inDialog?: boolean;
}

export const FormActions: FC<FormActionsProps> = ({ 
  isSubmitting, 
  onClose, 
  inDialog = true
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-2">
      {inDialog ? (
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
      ) : (
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancelar</Button>
        </DialogClose>
      )}
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Criando..." : "Criar Pipeline"}
      </Button>
    </div>
  );
};
