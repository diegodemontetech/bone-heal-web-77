
import * as z from "zod";

export const fieldSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  label: z.string().min(2, "Rótulo deve ter pelo menos 2 caracteres"),
  type: z.string(),
  required: z.boolean().default(false),
  display_in_kanban: z.boolean().default(false),
  options: z.string().optional(),
  mask: z.string().optional(),
  default_value: z.string().optional(),
});

export type FieldFormValues = z.infer<typeof fieldSchema>;

export const fieldTypes = [
  { value: "text", label: "Texto" },
  { value: "number", label: "Número" },
  { value: "email", label: "E-mail" },
  { value: "phone", label: "Telefone" },
  { value: "date", label: "Data" },
  { value: "time", label: "Hora" },
  { value: "datetime", label: "Data e Hora" },
  { value: "select", label: "Seleção" },
  { value: "radio", label: "Radio" },
  { value: "checkbox", label: "Checkbox" },
  { value: "textarea", label: "Área de Texto" },
  { value: "money", label: "Valor Monetário" },
  { value: "cpf", label: "CPF" },
  { value: "cnpj", label: "CNPJ" },
  { value: "cep", label: "CEP" }
];

export interface FieldsFormProps {
  onSuccess?: () => void;
}
