
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { StageFormValues } from "@/types/crm";

interface NameInputProps {
  form: UseFormReturn<StageFormValues>;
}

export function NameInput({ form }: NameInputProps) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome do Estágio</FormLabel>
          <FormControl>
            <Input placeholder="Ex: Novo, Em Progresso, Fechado" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
