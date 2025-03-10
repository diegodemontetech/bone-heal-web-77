
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateTicketForm from "./CreateTicketForm";

interface CreateTicketDialogProps {
  onSuccess: () => void;
}

const CreateTicketDialog = ({ onSuccess }: CreateTicketDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Ticket
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Ticket</DialogTitle>
        </DialogHeader>
        <CreateTicketForm onSuccess={() => {
          setIsOpen(false);
          onSuccess();
        }} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;
