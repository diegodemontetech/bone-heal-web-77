
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CRMStage } from "@/types/crm";

interface TriggerSectionProps {
  stages: CRMStage[];
  stage: string;
  nextStage: string;
  hoursTrigger: number;
  onStageChange: (value: string) => void;
  onNextStageChange: (value: string) => void;
  onHoursTriggerChange: (value: number) => void;
}

export function TriggerSection({ 
  stages, 
  stage, 
  nextStage, 
  hoursTrigger, 
  onStageChange, 
  onNextStageChange, 
  onHoursTriggerChange 
}: TriggerSectionProps) {
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stage">Estágio de Trigger</Label>
          <Select
            value={stage}
            onValueChange={onStageChange}
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
          <Label htmlFor="next_stage">Próximo Estágio (opcional)</Label>
          <Select
            value={nextStage}
            onValueChange={onNextStageChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um estágio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Não mover</SelectItem>
              {stages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hours_trigger">Gatilho de Tempo (horas)</Label>
        <Input
          id="hours_trigger"
          type="number"
          value={hoursTrigger}
          onChange={(e) => onHoursTriggerChange(Number(e.target.value))}
          min={1}
        />
        <p className="text-sm text-muted-foreground">
          Tempo em horas que o lead deve permanecer no estágio antes da automação ser disparada
        </p>
      </div>
    </div>
  );
}
