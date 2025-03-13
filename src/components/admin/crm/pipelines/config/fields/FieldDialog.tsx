
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { FieldForm } from "./FieldForm";
import { FieldDialogProps } from "./types";

export const FieldDialog = ({
  isOpen,
  onClose,
  currentField,
  onSubmit,
  formData,
  handleInputChange,
  handleSwitchChange,
  handleSelectChange,
  getDefaultMask,
  isSaving
}: FieldDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {currentField ? "Editar Campo" : "Novo Campo"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <FieldForm
            formData={formData}
            currentField={!!currentField}
            handleInputChange={handleInputChange}
            handleSwitchChange={handleSwitchChange}
            handleSelectChange={handleSelectChange}
            getDefaultMask={getDefaultMask}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Salvando..." : currentField ? "Atualizar" : "Criar"} Campo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
