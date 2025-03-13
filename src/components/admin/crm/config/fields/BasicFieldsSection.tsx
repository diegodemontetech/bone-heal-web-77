
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FieldFormValues } from "./types";

interface BasicFieldsSectionProps {
  form: UseFormReturn<FieldFormValues>;
}

export const BasicFieldsSection = ({ form }: BasicFieldsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome (ID do campo)</FormLabel>
            <FormControl>
              <Input placeholder="Ex: email_cliente" {...field} />
            </FormControl>
            <FormDescription>
              Usado internamente no sistema (sem espaços)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rótulo</FormLabel>
            <FormControl>
              <Input placeholder="Ex: E-mail do Cliente" {...field} />
            </FormControl>
            <FormDescription>
              Nome exibido no formulário
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
