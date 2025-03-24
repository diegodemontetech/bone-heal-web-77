
import React, { useState, useEffect } from "react";
import { Contact, Stage } from "@/types/crm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InteractionsList } from "./InteractionsList";
import { AttachmentsList } from "./AttachmentsList";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ContactDrawerProps {
  contact: Contact;
  open: boolean;
  onClose: () => void;
  onUpdate: () => Promise<void>;
  stages: Stage[];
}

export const ContactDrawer = ({ contact, open, onClose, onUpdate, stages }: ContactDrawerProps) => {
  const [formData, setFormData] = useState<Contact>(contact);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const isNewContact = !contact.id;

  useEffect(() => {
    setFormData(contact);
  }, [contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.full_name.trim()) {
      toast.error("O nome do contato é obrigatório");
      return;
    }

    try {
      setSaving(true);

      if (isNewContact) {
        // Criar novo contato
        const { data, error } = await supabase
          .from("crm_contacts")
          .insert({
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();

        if (error) throw error;
        
        // Registrar a primeira interação
        await supabase
          .from("crm_interactions")
          .insert({
            contact_id: data[0].id,
            interaction_type: "note",
            content: "Contato criado no sistema"
          });

        toast.success("Contato criado com sucesso");
      } else {
        // Atualizar contato existente
        const { error } = await supabase
          .from("crm_contacts")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
            last_interaction: new Date().toISOString()
          })
          .eq("id", contact.id);

        if (error) throw error;
        toast.success("Contato atualizado com sucesso");
      }

      await onUpdate();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar contato:", error);
      toast.error("Falha ao salvar contato");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!contact.id) return;
    
    if (!confirm("Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      setSaving(true);
      
      // Primeiro excluir as interações relacionadas
      await supabase
        .from("crm_interactions")
        .delete()
        .eq("contact_id", contact.id);
        
      // Depois excluir os anexos relacionados
      await supabase
        .from("crm_attachments")
        .delete()
        .eq("contact_id", contact.id);
      
      // Por fim, excluir o contato
      const { error } = await supabase
        .from("crm_contacts")
        .delete()
        .eq("id", contact.id);

      if (error) throw error;
      
      toast.success("Contato excluído com sucesso");
      await onUpdate();
      onClose();
    } catch (error) {
      console.error("Erro ao excluir contato:", error);
      toast.error("Falha ao excluir contato");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>
            {isNewContact ? "Novo Contato" : formData.full_name}
          </DrawerTitle>
          <DrawerDescription>
            {isNewContact
              ? "Preencha os dados para criar um novo contato"
              : `Última atualização: ${
                  formData.updated_at
                    ? format(new Date(formData.updated_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                    : "N/A"
                }`}
          </DrawerDescription>
        </DrawerHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="interactions">Interações</TabsTrigger>
            <TabsTrigger value="attachments">Anexos</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 overflow-y-auto h-[60vh] pb-20 pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome Completo *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage_id">Estágio</Label>
                <Select
                  value={formData.stage_id || ""}
                  onValueChange={(value) => handleSelectChange("stage_id", value)}
                >
                  <SelectTrigger id="stage_id">
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
                <Label htmlFor="cro">CRO</Label>
                <Input
                  id="cro"
                  name="cro"
                  value={formData.cro || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
                <Input
                  id="cpf_cnpj"
                  name="cpf_cnpj"
                  value={formData.cpf_cnpj || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade</Label>
                <Input
                  id="specialty"
                  name="specialty"
                  value={formData.specialty || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_type">Tipo de Cliente</Label>
                <Select
                  value={formData.client_type || ""}
                  onValueChange={(value) => handleSelectChange("client_type", value)}
                >
                  <SelectTrigger id="client_type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dentist">Dentista</SelectItem>
                    <SelectItem value="clinic">Clínica</SelectItem>
                    <SelectItem value="distributor">Distribuidor</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinic_name">Nome da Clínica</Label>
                <Input
                  id="clinic_name"
                  name="clinic_name"
                  value={formData.clinic_name || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  name="observations"
                  rows={3}
                  value={formData.observations || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="next_steps">Próximos Passos</Label>
                <Textarea
                  id="next_steps"
                  name="next_steps"
                  rows={3}
                  value={formData.next_steps || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interactions" className="overflow-y-auto h-[60vh] pb-20 pr-2">
            {!isNewContact ? (
              <InteractionsList contactId={contact.id} />
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Salve o contato primeiro para registrar interações
              </div>
            )}
          </TabsContent>

          <TabsContent value="attachments" className="overflow-y-auto h-[60vh] pb-20 pr-2">
            {!isNewContact ? (
              <AttachmentsList contactId={contact.id} />
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Salve o contato primeiro para adicionar anexos
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DrawerFooter className="border-t pt-4">
          <div className="flex justify-between w-full">
            <div>
              {!isNewContact && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={saving}
                >
                  Excluir Contato
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Salvando..." : "Salvar Contato"}
              </Button>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
