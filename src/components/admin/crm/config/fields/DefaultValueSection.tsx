
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FieldFormValues } from "./types";

interface DefaultValueSectionProps {
  form: UseFormReturn<FieldFormValues>;
}

export const DefaultValueSection = ({ form }: DefaultValueSectionProps) => {
  return (
    <FormField
      control={form.control}
      name="default_value"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Valor Padrão (opcional)</FormLabel>
          <FormControl>
            <Input 
              placeholder="Valor inicial do campo" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
