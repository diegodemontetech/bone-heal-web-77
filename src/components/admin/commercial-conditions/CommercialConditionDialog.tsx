
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CommercialConditionForm from "./CommercialConditionForm";
import { CommercialCondition } from "@/types/commercial-conditions";

interface CommercialConditionDialogProps {
  onSuccess: () => void;
  condition?: CommercialCondition | null;
  onCancel?: () => void;
  open?: boolean;
}

const CommercialConditionDialog = ({ 
  onSuccess, 
  condition = null,
  onCancel,
  open
}: CommercialConditionDialogProps) => {
  const isEditMode = !!condition;
  const dialogTitle = isEditMode ? "Editar Condição Comercial" : "Nova Condição Comercial";

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open && onCancel) onCancel();
    }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <CommercialConditionForm
          existingCondition={condition}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CommercialConditionDialog;
