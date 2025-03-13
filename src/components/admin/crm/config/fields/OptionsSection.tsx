
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OptionsSectionProps } from "./types";

export const OptionsSection = ({ form, watchType }: OptionsSectionProps) => {
  if (!["select", "radio", "checkbox"].includes(watchType)) {
    return null;
  }
  
  return (
    <FormField
      control={form.control}
      name="options"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Opções</FormLabel>
          <FormControl>
            <Input 
              placeholder="Opção 1, Opção 2, Opção 3" 
              {...field} 
              value={field.value || ""}
            />
          </FormControl>
          <FormDescription>
            Separe as opções por vírgula
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
