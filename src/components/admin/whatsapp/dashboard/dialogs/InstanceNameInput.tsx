
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InstanceNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const InstanceNameInput: React.FC<InstanceNameInputProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="py-4">
      <Label htmlFor="instance-name" className="mb-2 block">Nome da Instância</Label>
      <Input
        id="instance-name"
        placeholder="Nome da Instância"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
