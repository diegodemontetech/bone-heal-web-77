
import { FC } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FlowFormValues } from "../FlowCreateForm";
import { Switch } from "@/components/ui/switch";
import { Paperclip, User } from "lucide-react";

interface FormFieldsProps {
  form: UseFormReturn<FlowFormValues>;
  departments: any[];
  users: any[];
}

export const FormFields: FC<FormFieldsProps> = ({ form, departments, users }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Pipeline</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Pipeline de Leads" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Detalhe o propósito deste pipeline..."
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="department_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Departamento</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um departamento" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="responsible_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Responsável</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um responsável" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="has_attachment"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="flex items-center cursor-pointer">
                <Paperclip className="h-4 w-4 mr-1" />
                Permitir anexos
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};
