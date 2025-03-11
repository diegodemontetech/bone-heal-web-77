
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
import { VoucherForm } from "./VoucherForm";
import { Voucher } from "@/types/voucher";

interface VoucherDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isEditing: boolean;
  currentVoucher: Voucher | null;
  onSubmit: () => void;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
