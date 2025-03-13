
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Department } from "@/types/crm";
import { UseFormReturn } from "react-hook-form";

interface StageFormValues {
  name: string;
  color: string;
  department_id: string;
  order: number;
}

interface DepartmentSelectorProps {
  form: UseFormReturn<StageFormValues>;
  departments: Department[];
}

export function DepartmentSelector({ form, departments }: DepartmentSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="department_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Departamento</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um departamento" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
