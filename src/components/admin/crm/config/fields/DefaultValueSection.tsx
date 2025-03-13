
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormFieldProps } from "./types";

export const DefaultValueSection = ({ form }: FormFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="default_value"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Valor Padrão</FormLabel>
          <FormControl>
            <Input 
              placeholder="Valor padrão do campo" 
              {...field} 
              value={field.value || ""}
            />
          </FormControl>
          <FormDescription>
            Valor pré-preenchido quando o campo é exibido
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
