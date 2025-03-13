
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UserPermission } from "@/types/auth";

interface PermissionsConfigProps {
  pipelineId: string;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  is_admin?: boolean;
  role?: string;
}

interface PipelinePermission {
  id: string;
  pipeline_id: string;
  user_id: string;
  permission: string;
}

export const PermissionsConfig = ({ pipelineId }: PermissionsConfigProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchPermissions();
  }, [pipelineId]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, is_admin, role")
        .order("full_name");

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      toast.error("Erro ao carregar usuários");
    }
  };

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("crm_pipeline_permissions")
        .select("*")
        .eq("pipeline_id", pipelineId);

      if (error) throw error;

      // Organizar permissões por usuário
      const permissionsByUser: Record<string, string[]> = {};
      
      data?.forEach(perm => {
        if (!permissionsByUser[perm.user_id]) {
          permissionsByUser[perm.user_id] = [];
        }
        permissionsByUser[perm.user_id].push(perm.permission);
      });
      
      setPermissions(permissionsByUser);
    } catch (err) {
      console.error("Erro ao buscar permissões:", err);
      toast.error("Erro ao carregar permissões");
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (userId: string, permission: string): boolean => {
    return permissions[userId]?.includes(permission) || false;
  };

  const togglePermission = (userId: string, permission: string) => {
    setPermissions(prev => {
      const userPermissions = [...(prev[userId] || [])];
      
      if (userPermissions.includes(permission)) {
        return {
          ...prev,
          [userId]: userPermissions.filter(p => p !== permission)
        };
      } else {
        return {
          ...prev,
          [userId]: [...userPermissions, permission]
        };
      }
    });
  };

  const handleSavePermissions = async () => {
    setSaving(true);
    try {
      // Primeiro, excluímos todas as permissões existentes para este pipeline
      await supabase
        .from("crm_pipeline_permissions")
        .delete()
        .eq("pipeline_id", pipelineId);

      // Preparar novas permissões para inserção
      const permissionsToInsert: any[] = [];
      
      Object.entries(permissions).forEach(([userId, userPermissions]) => {
        userPermissions.forEach(permission => {
          permissionsToInsert.push({
            pipeline_id: pipelineId,
            user_id: userId,
            permission
          });
        });
      });

      // Inserir novas permissões
      if (permissionsToInsert.length > 0) {
        const { error } = await supabase
          .from("crm_pipeline_permissions")
          .insert(permissionsToInsert);

        if (error) throw error;
      }

      toast.success("Permissões salvas com sucesso");
    } catch (err) {
      console.error("Erro ao salvar permissões:", err);
      toast.error("Erro ao salvar permissões");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissões de Acesso</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          Configure quais usuários têm acesso a este pipeline e quais ações podem realizar.
        </p>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 text-xs uppercase font-semibold text-muted-foreground">Usuário</th>
                    <th className="p-3 text-xs uppercase font-semibold text-muted-foreground text-center">Visualizar</th>
                    <th className="p-3 text-xs uppercase font-semibold text-muted-foreground text-center">Editar</th>
                    <th className="p-3 text-xs uppercase font-semibold text-muted-foreground text-center">Excluir</th>
                    <th className="p-3 text-xs uppercase font-semibold text-muted-foreground text-center">Gerenciar</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-muted/30">
                      <td className="p-3">
                        <div className="font-medium">{user.full_name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        {user.is_admin && (
                          <div className="mt-1">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Administrador
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            id={`view-${user.id}`}
                            checked={hasPermission(user.id, "view") || user.is_admin}
                            onCheckedChange={() => !user.is_admin && togglePermission(user.id, "view")}
                            disabled={user.is_admin}
                          />
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            id={`edit-${user.id}`}
                            checked={hasPermission(user.id, "edit") || user.is_admin}
                            onCheckedChange={() => !user.is_admin && togglePermission(user.id, "edit")}
                            disabled={user.is_admin}
                          />
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            id={`delete-${user.id}`}
                            checked={hasPermission(user.id, "delete") || user.is_admin}
                            onCheckedChange={() => !user.is_admin && togglePermission(user.id, "delete")}
                            disabled={user.is_admin}
                          />
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            id={`manage-${user.id}`}
                            checked={hasPermission(user.id, "manage") || user.is_admin}
                            onCheckedChange={() => !user.is_admin && togglePermission(user.id, "manage")}
                            disabled={user.is_admin}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSavePermissions} disabled={saving}>
                {saving ? "Salvando..." : "Salvar permissões"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
