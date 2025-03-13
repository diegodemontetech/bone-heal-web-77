
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Schema de validação para o formulário
export const fieldSchema = z.object({
  name: z.string().min(2, "O nome precisa ter pelo menos 2 caracteres"),
  label: z.string().min(2, "O rótulo precisa ter pelo menos 2 caracteres"),
  type: z.string().min(1, "O tipo é obrigatório"),
  required: z.boolean().default(false),
  display_in_kanban: z.boolean().default(false),
  options: z.string().optional(),
  mask: z.string().optional().or(z.literal("")),
  default_value: z.string().optional().or(z.literal("")),
});

// Tipo derivado do schema
export type FieldFormValues = z.infer<typeof fieldSchema>;

// Props para o componente FieldsForm
export interface FieldsFormProps {
  onSuccess?: () => void;
}

// Props para componentes que usam o formulário
export interface FormFieldProps {
  form: UseFormReturn<FieldFormValues>;
}

// Props para as seções de formulário
export interface FormSectionProps {
  form: UseFormReturn<FieldFormValues>;
}

// Adição de props específicas para algumas seções
export interface MaskSectionProps extends FormSectionProps {
  watchType: string;
  getDefaultMask: (type: string) => string;
}

export interface OptionsSectionProps extends FormSectionProps {
  watchType: string;
}

// Tipos para a tabela de campos
export interface Field {
  id: string;
  name: string;
  type: string;
  department: string;
  required: boolean;
  showInCard: boolean;
  showInKanban: boolean;
}

// Lista de tipos de campos disponíveis
export const fieldTypes = [
  { id: "text", name: "Texto" },
  { id: "email", name: "E-mail" },
  { id: "phone", name: "Telefone" },
  { id: "number", name: "Número" },
  { id: "date", name: "Data" },
  { id: "select", name: "Seleção" },
  { id: "checkbox", name: "Checkbox" },
  { id: "radio", name: "Opções" },
  { id: "textarea", name: "Área de Texto" },
  { id: "file", name: "Arquivo" },
  { id: "currency", name: "Valor Monetário" },
  { id: "cpf", name: "CPF" },
  { id: "cnpj", name: "CNPJ" }
];
