
import { useState } from "react";
import { CRMField } from "@/types/crm";
import { FieldFormData } from "../types";

/**
 * Hook para gerenciar estado e manipuladores de formulário
 */
export const useFormHandlers = (currentField: CRMField | null) => {
  const [formData, setFormData] = useState<FieldFormData>({
    name: currentField?.name || "",
    label: currentField?.label || "",
    type: currentField?.type || "text",
    required: currentField?.required || false,
    display_in_kanban: currentField?.display_in_kanban || false,
    options: Array.isArray(currentField?.options) ? currentField.options.join(', ') : '',
    mask: currentField?.mask || "",
    default_value: currentField?.default_value || ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSwitchChange,
    handleSelectChange
  };
};
