
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InstanceNameInputProps } from "@/components/admin/whatsapp/types";

export const InstanceNameInput: React.FC<InstanceNameInputProps> = ({ value, onChange }) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Instância</Label>
        <Input
          id="name"
          placeholder="Ex: whatsapp-principal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Este nome será usado para identificar sua instância do WhatsApp.
          Use apenas letras, números e hífens.
        </p>
      </div>
    </div>
  );
};
