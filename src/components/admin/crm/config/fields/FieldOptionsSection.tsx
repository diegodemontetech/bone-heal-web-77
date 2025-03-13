
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FieldFormValues } from "./types";

interface FieldOptionsSectionProps {
  form: UseFormReturn<FieldFormValues>;
}

export const FieldOptionsSection = ({ form }: FieldOptionsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="required"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Campo obrigatório</FormLabel>
              <FormDescription>
                O preenchimento deste campo será exigido
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="display_in_kanban"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Exibir no Kanban</FormLabel>
              <FormDescription>
                Este campo será exibido nos cartões do Kanban
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
