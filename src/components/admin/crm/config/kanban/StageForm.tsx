
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

interface StageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (stage: any) => void;
  editingStage: any | null;
}

export const StageForm = ({ isOpen, onClose, onSave, editingStage }: StageFormProps) => {
  const [stageData, setStageData] = useState({
    name: "",
    color: "#3b82f6",
    department: "Vendas",
    order: 1
  });

  useEffect(() => {
    if (editingStage) {
      setStageData({
        name: editingStage.name,
        color: editingStage.color,
        department: editingStage.department,
        order: editingStage.order
      });
    } else {
      setStageData({
        name: "",
        color: "#3b82f6",
        department: "Vendas",
        order: 1
      });
    }
  }, [editingStage, isOpen]);

  const handleSave = () => {
    if (editingStage) {
      onSave({ ...editingStage, ...stageData });
    } else {
      onSave(stageData);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingStage ? "Editar Etapa" : "Nova Etapa"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Etapa</Label>
            <Input 
              id="name" 
              value={stageData.name}
              onChange={(e) => setStageData({ ...stageData, name: e.target.value })}
              placeholder="Ex: Novo, Em Progresso, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Select 
              value={stageData.department}
              onValueChange={(value) => setStageData({ ...stageData, department: value })}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Selecione o departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vendas">Vendas</SelectItem>
                <SelectItem value="Suporte">Suporte</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Cor</Label>
            <div className="flex gap-3 items-center">
              <Input 
                id="color" 
                type="color"
                value={stageData.color}
                onChange={(e) => setStageData({ ...stageData, color: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <Input 
                type="text"
                value={stageData.color}
                onChange={(e) => setStageData({ ...stageData, color: e.target.value })}
                placeholder="#000000"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="order">Ordem</Label>
            <Input 
              id="order" 
              type="number"
              min="1"
              value={stageData.order}
              onChange={(e) => setStageData({
                ...stageData, 
                order: parseInt(e.target.value) || 1
              })}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {editingStage ? "Salvar" : "Adicionar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
