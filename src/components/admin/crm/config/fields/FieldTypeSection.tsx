
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FieldFormValues, fieldTypes } from "./types";

interface FieldTypeSectionProps {
  form: UseFormReturn<FieldFormValues>;
  setFieldType: (value: string) => void;
}

export const FieldTypeSection = ({ form, setFieldType }: FieldTypeSectionProps) => {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de Campo</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              setFieldType(value);
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de campo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {fieldTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
