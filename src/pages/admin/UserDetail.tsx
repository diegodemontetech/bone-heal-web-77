import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2, User, ShieldCheck, Pencil, Save } from "lucide-react";
import { toast } from "sonner";
import { useUsers } from "@/components/admin/UsersContext";
import { availablePermissions } from "@/components/admin/users/permissions";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateUserPermissions } = useUsers();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [userForm, setUserForm] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (profileError) throw profileError;

      // Buscar permissões do usuário
      const { data: permissions, error: permissionsError } = await supabase
        .from("user_permissions")
        .select("permission")
        .eq("user_id", id);

      if (permissionsError) throw permissionsError;

      const permissionsList = permissions?.map(p => p.permission) || [];
      setSelectedPermissions(permissionsList);
      setUser({ ...profile, permissions: permissionsList });
      setUserForm({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    } catch (error) {
      console.error("Erro ao buscar detalhes do usuário:", error);
      toast.error("Erro ao carregar informações do usuário");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePermissions = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      await updateUserPermissions(user.id, selectedPermissions);
      toast.success("Permissões atualizadas com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar permissões:", error);
      toast.error("Erro ao atualizar permissões");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: userForm.full_name,
          phone: userForm.phone,
        })
        .eq("id", user.id);
        
      if (error) throw error;
      
      setUser({ ...user, ...userForm });
      setIsEditing(false);
      toast.success("Perfil atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions(current => 
      current.includes(permission) 
        ? current.filter(p => p !== permission)
        : [...current, permission]
    );
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">Usuário não encontrado</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => navigate("/admin/users")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para lista de usuários
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/admin/users")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Detalhes do Usuário</h1>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Permissões
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-semibold">Informações do Perfil</h2>
                {!isEditing ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Salvar
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nome Completo</Label>
                      <Input
                        id="full_name"
                        value={userForm.full_name}
                        onChange={(e) => setUserForm(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Nome completo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        value={userForm.email}
                        disabled
                        placeholder="E-mail"
                      />
                      <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={userForm.phone || ""}
                        onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Telefone"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
                        <p>{user.full_name || "Não informado"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                        <p>{user.email || "Não informado"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                        <p>{user.phone || "Não informado"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Função</p>
                        <p className="capitalize">{user.role || "Usuário"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
                        <p>{new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-semibold">Permissões do Usuário</h2>
                <Button 
                  onClick={handleSavePermissions}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Salvar Permissões
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetail;
