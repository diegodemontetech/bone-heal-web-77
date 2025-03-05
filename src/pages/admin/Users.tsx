
import { useState } from "react";
import AdminLayout from "@/components/admin/Layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, UserPlus, Edit, Trash2 } from "lucide-react";
import { UsersProvider, useUsers, availablePermissions } from "@/components/admin/UsersContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types/auth";
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
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth-context";

const UserRoleLabels = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.ADMIN_MASTER]: 'Administrador Master',
  [UserRole.DENTIST]: 'Dentista'
};

// Componente de lista de usuários
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

// Componente para criar novo usuário
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

// Componente principal
const Users = () => {
  return (
    <UsersProvider>
      <AdminLayout>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Usuários</h1>
            <CreateUserForm />
          </div>

          <div className="bg-white rounded-lg shadow">
            <UsersList />
          </div>
        </div>
      </AdminLayout>
    </UsersProvider>
  );
};

export default Users;
