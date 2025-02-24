
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface ProfessionalFieldsProps {
  form: UseFormReturn<any>;
  specialties: Array<{
    id: string;
    name: string;
    created_at: string | null;
  }>;
}

export const ProfessionalFields = ({ form, specialties }: ProfessionalFieldsProps) => {
  console.log('ProfessionalFields rendered with specialties:', {
    count: specialties?.length || 0,
    specialtiesList: specialties
  });

  return (
    <>
      <FormField
        control={form.control}
        name="specialty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Especialidade</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Selecione uma especialidade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {specialties && specialties.length > 0 ? (
                  specialties.map((specialty) => (
                    <SelectItem 
                      key={specialty.id} 
                      value={specialty.id}
                    >
                      {specialty.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-specialties" disabled>
                    Nenhuma especialidade encontrada
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cro"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CRO</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
