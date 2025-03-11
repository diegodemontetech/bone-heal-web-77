
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { UserRole } from "@/types/auth";
import { availablePermissions } from "@/components/admin/users/permissions";

interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_admin: boolean;
  created_at: string;
  permissions: string[];
  omie_code?: string;
  omie_sync?: boolean;
}

interface UsersTableProps {
  users: UserData[];
  isLoading: boolean;
  onEditUser: (user: UserData) => void;
  onDeleteUser: (user: UserData) => void;
  isAdminMaster: boolean;
}

const UserRoleLabels = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.ADMIN_MASTER]: 'Administrador Master',
  [UserRole.DENTIST]: 'Dentista'
};

const UsersTable = ({ 
  users, 
  isLoading, 
  onEditUser, 
  onDeleteUser, 
  isAdminMaster 
}: UsersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Função</TableHead>
          <TableHead>Permissões</TableHead>
          <TableHead>Data de Criação</TableHead>
          <TableHead>Omie</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            </TableCell>
          </TableRow>
        ) : users?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
              Nenhum usuário encontrado
            </TableCell>
          </TableRow>
        ) : (
          users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.full_name || "Sem nome"}</TableCell>
              <TableCell>{user.email || "Sem email"}</TableCell>
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
                {user.omie_code ? (
                  <Badge variant="outline" className="bg-green-100">
                    Integrado
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100">
                    Não integrado
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {user.role !== UserRole.ADMIN_MASTER && (
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => onEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {isAdminMaster && user.role !== UserRole.ADMIN_MASTER && (
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => onDeleteUser(user)}
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
  );
};

export default UsersTable;
