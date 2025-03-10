
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
import VoucherForm from "./VoucherForm";

interface VoucherDialogProps {
  onSuccess: () => void;
}

const VoucherDialog = ({ onSuccess }: VoucherDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Cupom
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar Novo Cupom</DialogTitle>
        </DialogHeader>
        <VoucherForm
          onSuccess={() => {
            setIsOpen(false);
            onSuccess();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default VoucherDialog;
