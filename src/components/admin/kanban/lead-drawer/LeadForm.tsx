
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface LeadFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  users: any[];
}

export const LeadForm = ({ formData, handleChange, handleSelectChange, users }: LeadFormProps) => {
  return (
    <div className="space-y-4 py-4">
      <div>
        <Label htmlFor="full_name">Nome Completo</Label>
        <Input 
          id="full_name" 
          name="full_name" 
          value={formData.full_name || ''} 
          onChange={handleChange} 
        />
      </div>
      
      <div>
        <Label htmlFor="clinic_name">Clínica</Label>
        <Input 
          id="clinic_name" 
          name="clinic_name" 
          value={formData.clinic_name || ''} 
          onChange={handleChange} 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input 
            id="phone" 
            name="phone" 
            value={formData.phone || ''} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={formData.email || ''} 
            onChange={handleChange} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cro">CRO</Label>
          <Input 
            id="cro" 
            name="cro" 
            value={formData.cro || ''} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <Label htmlFor="specialty">Especialidade</Label>
          <Input 
            id="specialty" 
            name="specialty" 
            value={formData.specialty || ''} 
            onChange={handleChange} 
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="responsible_id">Responsável</Label>
        <Select 
          value={formData.responsible_id || ''} 
          onValueChange={(value) => handleSelectChange('responsible_id', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um responsável" />
          </SelectTrigger>
          <SelectContent>
            {users.map(user => (
              <SelectItem key={user.id} value={user.id}>{user.full_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="address">Endereço</Label>
          <Input 
            id="address" 
            name="address" 
            value={formData.address || ''} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <Label htmlFor="city">Cidade</Label>
          <Input 
            id="city" 
            name="city" 
            value={formData.city || ''} 
            onChange={handleChange} 
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="state">Estado</Label>
        <Input 
          id="state" 
          name="state" 
          value={formData.state || ''} 
          onChange={handleChange} 
        />
      </div>
      
      <div>
        <Label htmlFor="observations">Observações</Label>
        <Textarea 
          id="observations" 
          name="observations" 
          value={formData.observations || ''} 
          onChange={handleChange} 
          rows={4}
        />
      </div>
      
      <div>
        <Label htmlFor="next_steps">Próximos Passos</Label>
        <Textarea 
          id="next_steps" 
          name="next_steps" 
          value={formData.next_steps || ''} 
          onChange={handleChange} 
          rows={2}
        />
      </div>
      
      <div>
        <Label htmlFor="next_interaction_date">Data da próxima interação</Label>
        <Input 
          id="next_interaction_date" 
          name="next_interaction_date" 
          type="date" 
          value={formData.next_interaction_date ? format(new Date(formData.next_interaction_date), "yyyy-MM-dd") : ''} 
          onChange={handleChange} 
        />
      </div>
    </div>
  );
};
