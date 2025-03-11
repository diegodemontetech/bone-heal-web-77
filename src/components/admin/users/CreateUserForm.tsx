
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Plus } from "lucide-react";
import { useUsers } from "./useUsers";
import { availablePermissions } from "./permissions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types/auth";

const CreateUserForm = () => {
  const { createUser } = useUsers();
  const [isOpen, setIsOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    full_name: "",
    role: UserRole.ADMIN,
    permissions: [] as string[]
  });

  const handleSubmit = async () => {
    await createUser(newUser);
    setIsOpen(false);
    setNewUser({
      email: "",
      password: "",
      full_name: "",
      role: UserRole.ADMIN,
      permissions: []
    });
  };

  const togglePermission = (permission: string) => {
    setNewUser(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <UserPlus className="w-4 h-4 mr-2" />
        Novo Usuário
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Usuário</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input
                id="full_name"
                value={newUser.full_name}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, full_name: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Tipo de Usuário</Label>
              <Select 
                value={newUser.role} 
                onValueChange={(value: UserRole) => 
                  setNewUser((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                  <SelectItem value={UserRole.ADMIN_MASTER}>Administrador Master</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newUser.role === UserRole.ADMIN && (
              <div className="space-y-2">
                <Label>Permissões</Label>
                <div className="grid grid-cols-2 gap-4">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`new-${permission.id}`}
                        checked={newUser.permissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                      />
                      <label
                        htmlFor={`new-${permission.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Usuário
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateUserForm;
