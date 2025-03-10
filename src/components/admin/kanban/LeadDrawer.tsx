
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Save, Trash, MessageSquare, History, X } from "lucide-react";
import { useUsersQuery } from "./hooks/useUsersQuery";
import { useLeadActions } from "./hooks/useLeadActions";
import { formatCurrency } from "@/lib/utils";

interface LeadDrawerProps {
  open: boolean;
  onClose: () => void;
  lead: any | null;
  onLeadUpdate: () => void;
}

export const LeadDrawer = ({ open, onClose, lead, onLeadUpdate }: LeadDrawerProps) => {
  const [formData, setFormData] = useState<any>({});
  const { users } = useUsersQuery();
  const { updateLead, deleteLead } = useLeadActions();
  
  useEffect(() => {
    if (lead) {
      setFormData(lead);
    }
  }, [lead]);

  if (!lead) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await updateLead(lead.id, formData);
    onLeadUpdate();
  };

  const handleDelete = async () => {
    await deleteLead(lead.id);
    onClose();
    onLeadUpdate();
  };

  return (
    <Sheet open={open} onOpenChange={open => !open && onClose()}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex justify-between items-center">
            <SheetTitle>Detalhes do Lead</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Origem</Label>
              <Select
                value={formData.source || ''}
                onValueChange={(value) => handleSelectChange('source', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="form">Formulário</SelectItem>
                  <SelectItem value="whatsapp_widget">WhatsApp</SelectItem>
                  <SelectItem value="phone">Telefone</SelectItem>
                  <SelectItem value="indication">Indicação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                name="state"
                value={formData.state || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigned_to">Responsável</Label>
            <Select
              value={formData.assigned_to || ''}
              onValueChange={(value) => handleSelectChange('assigned_to', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um responsável" />
              </SelectTrigger>
              <SelectContent>
                {users?.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes || ''}
              onChange={handleChange}
            />
          </div>

          {lead.orders && lead.orders.length > 0 && (
            <div className="space-y-2">
              <Label>Histórico de Pedidos</Label>
              <div className="border rounded-md divide-y">
                {lead.orders.map((order: any) => (
                  <div key={order.id} className="p-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Pedido #{order.id.substring(0, 8)}</span>
                      <span>{formatCurrency(order.total_amount)}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(order.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Informações do Lead</Label>
            <div className="text-sm space-y-1 text-gray-500">
              <p>Criado em: {format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
              {lead.last_contact && (
                <p>Último contato: {format(new Date(lead.last_contact), "dd/MM/yyyy", { locale: ptBR })}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </div>
            <div className="space-x-2">
              <Button variant="ghost" size="icon">
                <History className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={handleDelete}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
