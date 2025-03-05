
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types/auth";
import { useUsers, availablePermissions } from "@/components/admin/UsersContext";
import { useAuth } from "@/hooks/use-auth-context";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const UserRoleLabels = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.ADMIN_MASTER]: 'Administrador Master',
  [UserRole.DENTIST]: 'Dentista'
};

const UsersList = () => {
  const { users, isLoading, deleteUser, updateUserPermissions } = useUsers();
  const { isAdminMaster } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const openEditDialog = (user: any) => {
    setSelectedUser(user);
    setSelectedPermissions(user.permissions || []);
    setIsEditOpen(true);
  };

  const openDeleteDialog = (user: any) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id);
      setIsDeleteOpen(false);
    }
  };

  const handleSavePermissions = async () => {
    if (selectedUser) {
      await updateUserPermissions(selectedUser.id, selectedPermissions);
      setIsEditOpen(false);
    }
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions(current => 
      current.includes(permission) 
        ? current.filter(p => p !== permission)
        : [...current, permission]
    );
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Permissões</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              </TableCell>
            </TableRow>
          ) : users?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                Nenhum usuário encontrado
              </TableCell>
            </TableRow>
          ) : (
            users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role ? (
                    <Badge variant="outline">
                      {UserRoleLabels[user.role] || user.role}
                    </Badge>
                  ) : user.is_admin ? (
                    <Badge variant="outline">Administrador</Badge>
                  ) : (
                    <Badge variant="outline">Usuário</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.permissions?.length > 0 ? (
                      user.permissions.map((permission: string) => (
                        <Badge
                          key={permission}
                          className="bg-primary/10 text-primary"
                        >
                          {availablePermissions.find(p => p.id === permission)?.label || permission}
                        </Badge>
                      ))
                    ) : user.role === UserRole.ADMIN_MASTER ? (
                      <Badge variant="default">Todas as permissões</Badge>
                    ) : (
                      <span className="text-gray-500 text-sm">Nenhuma</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {user.role !== UserRole.ADMIN_MASTER && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {isAdminMaster && user.role !== UserRole.ADMIN_MASTER && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => openDeleteDialog(user)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Dialog de edição de permissões */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
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
                      onCheckedChange={() => togglePermission(permission.id)}
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
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePermissions}>
              Salvar Permissões
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação para excluir */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário <strong>{selectedUser?.full_name}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteUser}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UsersList;
