
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface StageFormData {
  name: string;
  color: string;
  department_id: string;
  order?: number;
  pipeline_id?: string;
}

interface NewStageFormProps {
  onAdd: (stage: StageFormData) => Promise<void>;
  isLoading: boolean;
}

export const NewStageForm = ({ onAdd, isLoading }: NewStageFormProps) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [departmentId, setDepartmentId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onAdd({
      name,
      color,
      department_id: departmentId
    });

    // Resetar o formulário
    setName("");
    setColor("#3b82f6");
    setDepartmentId("");
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-md p-4 space-y-4">
      <h3 className="text-lg font-medium">Adicionar Novo Estágio</h3>
      
      <div className="space-y-2">
        <Label htmlFor="stage-name">Nome</Label>
        <Input
          id="stage-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Prospecção"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Cor</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              style={{ backgroundColor: color, color: "#fff" }}
            >
              {color}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <HexColorPicker color={color} onChange={setColor} />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="department">Departamento</Label>
        <Select 
          value={departmentId} 
          onValueChange={setDepartmentId}
        >
          <SelectTrigger id="department">
            <SelectValue placeholder="Selecione um departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Nenhum</SelectItem>
            <SelectItem value="dept-1">Vendas</SelectItem>
            <SelectItem value="dept-2">Suporte</SelectItem>
            <SelectItem value="dept-3">Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" disabled={isLoading || !name.trim()}>
        {isLoading ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-50 border-t-transparent"></span>
            Salvando...
          </>
        ) : (
          "Adicionar Estágio"
        )}
      </Button>
    </form>
  );
};
