
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CommercialConditionForm from "./CommercialConditionForm";

interface CommercialCondition {
  id: string;
  name: string;
  description: string;
  discount_type: string;
  discount_value: number;
  is_active: boolean;
  payment_method: string | null;
  min_amount: number | null;
  min_items: number | null;
  valid_until: string | null;
  region: string | null;
  customer_group: string | null;
  free_shipping: boolean;
}

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
  open: externalOpen
}: CommercialConditionDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const isEditMode = !!condition;
  const dialogTitle = isEditMode ? "Editar Condição Comercial" : "Nova Condição Comercial";
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && onCancel) {
      onCancel();
    }
  };

  // Use externally controlled state if provided
  const open = externalOpen !== undefined ? externalOpen : isOpen;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isEditMode && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nova Condição
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <CommercialConditionForm
          existingCondition={condition}
          onSuccess={() => {
            setIsOpen(false);
            onSuccess();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CommercialConditionDialog;
