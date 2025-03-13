
import { FC, ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DialogWrapperProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  children: ReactNode;
}

export const DialogWrapper: FC<DialogWrapperProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
