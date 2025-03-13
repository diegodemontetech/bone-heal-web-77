
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldForm } from "./FieldForm";

interface FieldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const FieldDialog = ({ isOpen, onClose, title, children }: FieldDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsDialogOpen => !setIsDialogOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
