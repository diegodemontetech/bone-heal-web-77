
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ShippingRateFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isEditing: boolean;
  formData: {
    region: string;
    zip_code_start: string;
    zip_code_end: string;
    flat_rate: string;
    additional_kg_rate: string;
    estimated_days: string;
    is_active: boolean;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCreateRate: () => Promise<void>;
  resetForm: () => void;
}

export const ShippingRateForm: React.FC<ShippingRateFormProps> = ({
  isOpen,
  setIsOpen,
  isEditing,
  formData,
  handleInputChange,
  handleSelectChange,
  handleCreateRate,
  resetForm
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Taxa de Envio" : "Criar Nova Taxa de Envio"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="region">Região</Label>
            <Select
              value={formData.region}
              onValueChange={(value) => handleSelectChange("region", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a região" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sudeste">Sudeste</SelectItem>
                <SelectItem value="Sul">Sul</SelectItem>
                <SelectItem value="Centro-Oeste">Centro-Oeste</SelectItem>
                <SelectItem value="Nordeste">Nordeste</SelectItem>
                <SelectItem value="Norte">Norte</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zip_code_start">CEP Inicial</Label>
              <Input
                id="zip_code_start"
                name="zip_code_start"
                value={formData.zip_code_start}
                onChange={handleInputChange}
                placeholder="Ex: 01000000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zip_code_end">CEP Final</Label>
              <Input
                id="zip_code_end"
                name="zip_code_end"
                value={formData.zip_code_end}
                onChange={handleInputChange}
                placeholder="Ex: 09999999"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flat_rate">Taxa Base (R$)</Label>
              <Input
                id="flat_rate"
                name="flat_rate"
                type="number"
                value={formData.flat_rate}
                onChange={handleInputChange}
                placeholder="Ex: 15.90"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additional_kg_rate">Taxa por Kg Adicional (R$)</Label>
              <Input
                id="additional_kg_rate"
                name="additional_kg_rate"
                type="number"
                value={formData.additional_kg_rate}
                onChange={handleInputChange}
                placeholder="Ex: 2.50"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="estimated_days">Prazo Estimado (dias)</Label>
            <Input
              id="estimated_days"
              name="estimated_days"
              type="number"
              value={formData.estimated_days}
              onChange={handleInputChange}
              placeholder="Ex: 5"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="is_active">Taxa Ativa</Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateRate}>
              {isEditing ? "Atualizar" : "Criar"} Taxa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
