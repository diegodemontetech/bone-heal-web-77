
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { UserData } from "./types";
import { availablePermissions } from "./permissions";

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: UserData | null;
  selectedPermissions: string[];
  onPermissionToggle: (permission: string) => void;
  onSavePermissions: () => Promise<void>;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  isOpen,
  onClose,
  selectedUser,
  selectedPermissions,
  onPermissionToggle,
  onSavePermissions,
}) => {
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSavePermissions();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Permissões de Usuário</DialogTitle>
        </DialogHeader>

        {selectedUser && (
          <div className="py-4">
            <div className="mb-4">
              <p className="font-semibold">{selectedUser.full_name}</p>
              <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
            </div>

            <div className="space-y-4">
              <Label>Permissões</Label>
              <div className="grid grid-cols-2 gap-4">
                {availablePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${permission.id}`}
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={() => onPermissionToggle(permission.id)}
                    />
                    <label
                      htmlFor={`edit-${permission.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
