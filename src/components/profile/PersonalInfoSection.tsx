
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dentistSpecialties } from "@/utils/specialties";

interface PersonalInfoSectionProps {
  formData: {
    full_name: string;
    specialty: string;
    cro: string;
    cpf: string;
    cnpj: string;
    phone?: string; // Adicionando phone aos dados do formulário
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  handleChange,
  handleSelectChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name">Nome Completo</Label>
        <Input
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="specialty">Especialidade</Label>
          <Select 
            onValueChange={(value) => handleSelectChange('specialty', value)}
            value={formData.specialty}
            defaultValue={formData.specialty}
          >
            <SelectTrigger id="specialty" className="w-full">
              <SelectValue placeholder="Selecione sua especialidade" />
            </SelectTrigger>
            <SelectContent>
              {dentistSpecialties.map((specialty) => (
                <SelectItem key={specialty.value} value={specialty.value}>
                  {specialty.label}
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
            value={formData.cro}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={(e) => {
              // Máscara de telefone consistente com o formulário de cadastro
              let value = e.target.value.replace(/\D/g, '');
              if (value.length > 11) value = value.slice(0, 11);
              
              if (value.length > 2) {
                if (value.length > 7) {
                  if (value.length >= 11) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
                  } else if (value.length >= 10) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6, 10)}`;
                  } else if (value.length > 6) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
                  } else {
                    value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                  }
                } else {
                  value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                }
              }
              
              const event = {
                ...e,
                target: {
                  ...e.target,
                  name: e.target.name,
                  value: value
                }
              };
              
              handleChange(event);
            }}
            placeholder="(00) 00000-0000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};
