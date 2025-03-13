
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormFieldProps } from "./types";

// Importamos os tipos de campo do arquivo correto
// Esta é a lista de tipos de campo que será usada no componente Select
const fieldTypes = [
  { value: "text", label: "Texto" },
  { value: "number", label: "Número" },
  { value: "email", label: "E-mail" },
  { value: "phone", label: "Telefone" },
  { value: "date", label: "Data" },
  { value: "datetime", label: "Data e Hora" },
  { value: "select", label: "Seleção" },
  { value: "radio", label: "Opções (Radio)" },
  { value: "checkbox", label: "Checkbox" },
  { value: "textarea", label: "Área de Texto" },
  { value: "money", label: "Valor Monetário" },
  { value: "cpf", label: "CPF" },
  { value: "cnpj", label: "CNPJ" },
  { value: "cep", label: "CEP" },
  { value: "url", label: "URL" },
  { value: "file", label: "Arquivo" },
  { value: "image", label: "Imagem" }
];

export const FieldTypeSection = ({ form }: FormFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de Campo</FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de campo" />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
