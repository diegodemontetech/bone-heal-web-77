
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VoucherForm } from "./VoucherForm";
import { Voucher } from "@/types/voucher";
import { FormEvent } from "react";

interface VoucherDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isEditing: boolean;
  currentVoucher: Voucher | null;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange?: (name: string, value: string) => void;
  resetForm: () => void;
}

export const VoucherDialog = ({
  isOpen,
  setIsOpen,
  isEditing,
  currentVoucher,
  onSubmit,
  formData,
  handleInputChange,
  handleSelectChange,
  resetForm,
}: VoucherDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Cupom" : "Criar Novo Cupom"}</DialogTitle>
        </DialogHeader>
        <VoucherForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          onSubmit={onSubmit}
          onCancel={() => {
            setIsOpen(false);
            resetForm();
          }}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
};
