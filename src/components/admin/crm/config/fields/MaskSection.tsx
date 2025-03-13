
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FieldFormValues } from "./types";

interface MaskSectionProps {
  form: UseFormReturn<FieldFormValues>;
  watchType: string;
  getDefaultMask: (type: string) => string;
}

export const MaskSection = ({ form, watchType, getDefaultMask }: MaskSectionProps) => {
  if (!["phone", "cpf", "cnpj", "cep", "money"].includes(watchType)) {
    return null;
  }
  
  return (
    <FormField
      control={form.control}
      name="mask"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Máscara</FormLabel>
          <FormControl>
            <Input 
              placeholder="Máscara para formatação" 
              {...field} 
              value={field.value || getDefaultMask(watchType)}
            />
          </FormControl>
          <FormDescription>
            Formato para exibição do campo
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
