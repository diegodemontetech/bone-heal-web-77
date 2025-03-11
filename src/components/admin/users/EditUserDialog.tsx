
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/auth";
import { availablePermissions } from "./permissions";

interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  permissions: string[];
  created_at: string;
}

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: UserData | null;
  selectedPermissions: string[];
  onPermissionToggle: (permission: string) => void;
  onSavePermissions: () => Promise<void>;
}

const EditUserDialog = ({
  isOpen,
  onClose,
  selectedUser,
  selectedPermissions,
  onPermissionToggle,
  onSavePermissions
}: EditUserDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Permissões do Usuário</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <p><strong>Usuário:</strong> {selectedUser?.full_name}</p>
            <p><strong>Email:</strong> {selectedUser?.email}</p>
          </div>

          <div className="space-y-2">
            <Label>Permissões</Label>
            <div className="grid grid-cols-2 gap-4">
              {availablePermissions.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission.id}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={() => onPermissionToggle(permission.id)}
                  />
                  <label
                    htmlFor={permission.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {permission.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSavePermissions}>
            Salvar Permissões
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
