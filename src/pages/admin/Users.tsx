
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, UserPlus } from "lucide-react";

const PERMISSIONS = [
  { id: 'manage_products', label: 'Gerenciar Produtos' },
  { id: 'manage_orders', label: 'Gerenciar Pedidos' },
  { id: 'manage_customers', label: 'Gerenciar Clientes' },
  { id: 'manage_support', label: 'Gerenciar Suporte' },
  { id: 'manage_users', label: 'Gerenciar Usuários' },
  { id: 'view_reports', label: 'Visualizar Relatórios' },
  { id: 'manage_settings', label: 'Gerenciar Configurações' },
  { id: 'manage_integrations', label: 'Gerenciar Integrações' },
];

const Users = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    full_name: "",
    permissions: [] as string[],
  });

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from("profiles")
        .select(`
          *,
          user_permissions (permission)
        `)
        .eq("is_admin", true);

      if (error) throw error;
      return users;
    },
  });

  const handleCreateUser = async () => {
    try {
      // Criar usuário no Auth
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            full_name: newUser.full_name,
          },
        },
      });

      if (authError) throw authError;

      // Atualizar perfil como admin
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ is_admin: true })
        .eq("id", authUser.user?.id);

      if (profileError) throw profileError;

      // Adicionar permissões
      if (newUser.permissions.length > 0) {
        const { error: permissionsError } = await supabase
          .from("user_permissions")
          .insert(
            newUser.permissions.map(permission => ({
              user_id: authUser.user?.id,
              permission,
            }))
          );

        if (permissionsError) throw permissionsError;
      }

      toast.success("Usuário criado com sucesso!");
      setIsCreateOpen(false);
      setNewUser({
        email: "",
        password: "",
        full_name: "",
        permissions: [],
      });
      refetch();
    } catch (error: any) {
      toast.error("Erro ao criar usuário: " + error.message);
    }
  };

  const togglePermission = (permission: string) => {
    setNewUser(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Usuários</h1>
          <Button onClick={() => setIsCreateOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead>Data de Criação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : users?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.user_permissions?.map((p: any) => (
                          <span
                            key={p.permission}
                            className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                          >
                            {PERMISSIONS.find(perm => perm.id === p.permission)?.label || p.permission}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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
                <Label>Permissões</Label>
                <div className="grid grid-cols-2 gap-4">
                  {PERMISSIONS.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission.id}
                        checked={newUser.permissions.includes(permission.id)}
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
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateUser}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Usuário
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Users;
