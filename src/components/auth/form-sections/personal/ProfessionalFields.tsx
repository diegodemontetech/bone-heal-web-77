
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
  return (
    <>
      <FormField
        control={form.control}
        name="specialty"
        rules={{ required: "Especialidade é obrigatória" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Especialidade</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Selecione uma especialidade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {specialties && specialties.length > 0 ? (
                  specialties.map((specialty) => (
                    <SelectItem key={specialty.id} value={specialty.name || specialty.id}>
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
        rules={{ required: "CRO é obrigatório" }}
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
