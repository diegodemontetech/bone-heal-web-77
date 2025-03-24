
import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Stage, Contact } from "@/types/crm";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save, Trash } from "lucide-react";
import { toast } from "sonner";
import { InteractionsList } from "./InteractionsList";
import { AttachmentsList } from "./AttachmentsList";

interface ContactDrawerProps {
  contact: Contact;
  open: boolean;
  onClose: () => void;
  onUpdate: () => Promise<void>;
  stages: Stage[];
}

export const ContactDrawer = ({
  contact,
  open,
  onClose,
  onUpdate,
  stages
}: ContactDrawerProps) => {
  const [formData, setFormData] = useState<Contact>({ ...contact });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [newInteraction, setNewInteraction] = useState("");
  const [interactionType, setInteractionType] = useState("note");
  
  useEffect(() => {
    if (contact) {
      setFormData({ ...contact });
    }
  }, [contact]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSaveContact = async () => {
    try {
      setSaving(true);
      
      // Atualizar contato
      const { error } = await supabase
        .from("crm_contacts")
        .update({
          full_name: formData.full_name || formData.name,
          stage_id: formData.stage_id,
          email: formData.email,
          whatsapp: formData.whatsapp || formData.phone,
          cro: formData.cro,
          cpf_cnpj: formData.cpf_cnpj,
          specialty: formData.specialty,
          observations: formData.observations || formData.notes,
          next_interaction_date: formData.next_interaction_date,
          next_steps: formData.next_steps,
          client_type: formData.client_type,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          updated_at: new Date().toISOString(),
          last_interaction: new Date().toISOString()
        })
        .eq("id", contact.id);
        
      if (error) throw error;
      
      await onUpdate();
      toast.success("Contato atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar contato:", error);
      toast.error("Erro ao atualizar contato");
    } finally {
      setSaving(false);
    }
  };
  
  const handleDeleteContact = async () => {
    if (!confirm("Tem certeza que deseja excluir este contato?")) return;
    
    try {
      setSaving(true);
      
      // Excluir contato
      const { error } = await supabase
        .from("crm_contacts")
        .delete()
        .eq("id", contact.id);
        
      if (error) throw error;
      
      await onUpdate();
      onClose();
      toast.success("Contato excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir contato:", error);
      toast.error("Erro ao excluir contato");
    } finally {
      setSaving(false);
    }
  };
  
  const handleAddInteraction = async () => {
    if (!newInteraction.trim()) return;
    
    try {
      // Adicionar interação
      const { error } = await supabase
        .from("crm_interactions")
        .insert({
          contact_id: contact.id,
          interaction_type: interactionType,
          content: newInteraction,
          interaction_date: new Date().toISOString(),
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      // Atualizar último contato
      await supabase
        .from("crm_contacts")
        .update({
          last_interaction: new Date().toISOString()
        })
        .eq("id", contact.id);
      
      setNewInteraction("");
      toast.success("Interação adicionada com sucesso!");
      await onUpdate();
    } catch (error) {
      console.error("Erro ao adicionar interação:", error);
      toast.error("Erro ao adicionar interação");
    }
  };
  
  return (
    <Drawer open={open} onOpenChange={open => !open && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle className="flex justify-between items-center">
            <span>{formData.full_name || formData.name}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DrawerTitle>
          <DrawerDescription>
            Edite os dados do contato ou adicione interações
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="p-4 pt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="interactions">Interações</TabsTrigger>
              <TabsTrigger value="attachments">Anexos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo</Label>
                  <Input 
                    id="full_name"
                    name="full_name"
                    value={formData.full_name || formData.name || ""}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stage_id">Estágio</Label>
                  <Select 
                    value={formData.stage_id || formData.stage || ""}
                    onValueChange={value => handleSelectChange("stage_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar estágio" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map(stage => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp / Telefone</Label>
                  <Input 
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp || formData.phone || ""}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
                  <Input 
                    id="cpf_cnpj"
                    name="cpf_cnpj"
                    value={formData.cpf_cnpj || ""}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cro">CRO</Label>
                  <Input 
                    id="cro"
                    name="cro"
                    value={formData.cro || ""}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2 col-span-full">
                  <Label htmlFor="observations">Observações</Label>
                  <Textarea 
                    id="observations"
                    name="observations"
                    value={formData.observations || formData.notes || ""}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="interactions">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Select 
                      value={interactionType}
                      onValueChange={setInteractionType}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="note">Nota</SelectItem>
                        <SelectItem value="call">Ligação</SelectItem>
                        <SelectItem value="meeting">Reunião</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input 
                      value={newInteraction}
                      onChange={e => setNewInteraction(e.target.value)}
                      placeholder="Adicionar nova interação..."
                      className="flex-1"
                    />
                    
                    <Button onClick={handleAddInteraction}>Adicionar</Button>
                  </div>
                </div>
                
                <InteractionsList contactId={contact.id} />
              </div>
            </TabsContent>
            
            <TabsContent value="attachments">
              <AttachmentsList contactId={contact.id} />
            </TabsContent>
          </Tabs>
        </div>
        
        <DrawerFooter className="flex justify-between">
          <Button 
            variant="destructive" 
            onClick={handleDeleteContact}
            disabled={saving}
          >
            <Trash className="h-4 w-4 mr-2" />
            Excluir Contato
          </Button>
          
          <Button 
            onClick={handleSaveContact}
            disabled={saving}
          >
            {saving ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar Alterações
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
