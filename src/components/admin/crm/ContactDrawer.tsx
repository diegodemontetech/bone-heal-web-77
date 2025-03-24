
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { InteractionsList } from "./InteractionsList";
import { AttachmentsList } from "./AttachmentsList";
import { Save, Trash, X, Plus, Send } from "lucide-react";
import { toast } from "sonner";
import { Contact, Stage } from "@/types/crm";

interface ContactDrawerProps {
  contact: Contact | null;
  open: boolean;
  onClose: () => void;
  onContactUpdated: () => void;
  stages: Stage[];
}

export const ContactDrawer = ({ 
  contact, 
  open, 
  onClose, 
  onContactUpdated,
  stages 
}: ContactDrawerProps) => {
  const [formData, setFormData] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [newInteraction, setNewInteraction] = useState("");
  const [interactionType, setInteractionType] = useState("note");

  useEffect(() => {
    if (contact) {
      setFormData(contact);
    }
  }, [contact]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('is_admin', true);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;

    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    if (!formData) return;

    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      setLoading(true);

      if (formData.id) {
        // Atualizar contato existente na tabela leads já que crm_contacts não está disponível
        const { error } = await supabase
          .from('leads')
          .update({
            name: formData.full_name,
            email: formData.email,
            phone: formData.whatsapp,
            notes: formData.observations,
            stage_id: formData.stage_id,
            assigned_to: formData.responsible_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', formData.id);

        if (error) throw error;
        toast.success("Contato atualizado com sucesso");
      } else {
        // Criar novo contato na tabela leads
        const { error } = await supabase
          .from('leads')
          .insert({
            name: formData.full_name,
            email: formData.email,
            phone: formData.whatsapp,
            notes: formData.observations,
            stage_id: formData.stage_id,
            assigned_to: formData.responsible_id,
            created_at: new Date().toISOString(),
            last_contact: new Date().toISOString()
          });

        if (error) throw error;
        toast.success("Contato criado com sucesso");
      }

      onContactUpdated();
    } catch (error: any) {
      console.error('Erro ao salvar contato:', error);
      toast.error(`Erro ao salvar contato: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData?.id) return;

    try {
      setDeleting(true);
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', formData.id);

      if (error) throw error;
      toast.success("Contato excluído com sucesso");
      onContactUpdated();
    } catch (error: any) {
      console.error('Erro ao excluir contato:', error);
      toast.error(`Erro ao excluir contato: ${error.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleAddInteraction = async () => {
    if (!formData?.id || !newInteraction.trim()) return;

    try {
      // Como não temos a tabela crm_interactions nos tipos,
      // vamos atualizar o lead com a última interação
      const { error } = await supabase
        .from('leads')
        .update({
          last_contact: new Date().toISOString(),
          notes: formData.observations 
            ? `${formData.observations}\n\n${new Date().toLocaleString()}: ${newInteraction}`
            : `${new Date().toLocaleString()}: ${newInteraction}`
        })
        .eq('id', formData.id);

      if (error) throw error;
      toast.success("Interação adicionada com sucesso");
      setNewInteraction("");
        
    } catch (error: any) {
      console.error('Erro ao adicionar interação:', error);
      toast.error(`Erro ao adicionar interação: ${error.message}`);
    }
  };

  if (!formData) return null;

  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-4">
          <div className="flex justify-between items-center">
            <SheetTitle>{formData.id ? 'Editar Contato' : 'Novo Contato'}</SheetTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <Tabs defaultValue="info">
          <TabsList className="mb-4">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="interactions">Interações</TabsTrigger>
            <TabsTrigger value="attachments">Anexos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cro">CRO</Label>
                <Input
                  id="cro"
                  name="cro"
                  value={formData.cro || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
                <Input
                  id="cpf_cnpj"
                  name="cpf_cnpj"
                  value={formData.cpf_cnpj || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade</Label>
                <Input
                  id="specialty"
                  name="specialty"
                  value={formData.specialty || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinic_name">Clínica/Consultório</Label>
              <Input
                id="clinic_name"
                name="clinic_name"
                value={formData.clinic_name || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stage_id">Estágio</Label>
                <Select
                  value={formData.stage_id}
                  onValueChange={(value) => handleSelectChange('stage_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um estágio" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsible_id">Responsável</Label>
                <Select
                  value={formData.responsible_id || ''}
                  onValueChange={(value) => handleSelectChange('responsible_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_type">Tipo de Cliente</Label>
                <Select
                  value={formData.client_type || 'novo'}
                  onValueChange={(value) => handleSelectChange('client_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novo">Novo</SelectItem>
                    <SelectItem value="recorrente">Recorrente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="next_interaction_date">Próxima Interação</Label>
                <Input
                  id="next_interaction_date"
                  name="next_interaction_date"
                  type="datetime-local"
                  value={formData.next_interaction_date?.slice(0, 16) || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                name="observations"
                rows={3}
                value={formData.observations || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_steps">Próximos Passos</Label>
              <Textarea
                id="next_steps"
                name="next_steps"
                rows={2}
                value={formData.next_steps || ''}
                onChange={handleInputChange}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="interactions">
            {formData.id ? (
              <div className="space-y-4">
                <InteractionsList contactId={formData.id} />
                
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex gap-2">
                    <Select
                      value={interactionType}
                      onValueChange={setInteractionType}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="note">Anotação</SelectItem>
                        <SelectItem value="call">Ligação</SelectItem>
                        <SelectItem value="meeting">Reunião</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex-1">
                      <Textarea
                        placeholder="Adicionar uma nova interação..."
                        value={newInteraction}
                        onChange={(e) => setNewInteraction(e.target.value)}
                        className="h-20"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleAddInteraction}
                      disabled={!newInteraction.trim()}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>Salve o contato primeiro para adicionar interações</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="attachments">
            {formData.id ? (
              <AttachmentsList contactId={formData.id} />
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>Salve o contato primeiro para adicionar anexos</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-6">
          <div>
            {formData.id && (
              <Button 
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting || loading}
              >
                <Trash className="mr-2 h-4 w-4" />
                {deleting ? 'Excluindo...' : 'Excluir'}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={loading}
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
