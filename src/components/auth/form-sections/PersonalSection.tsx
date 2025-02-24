
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { PhysicalPersonFields } from "./personal/PhysicalPersonFields";
import { LegalPersonFields } from "./personal/LegalPersonFields";
import { ProfessionalFields } from "./personal/ProfessionalFields";

interface PersonalSectionProps {
  form: UseFormReturn<any>;
  specialties: Array<{
    id: string;
    name: string;
    created_at: string | null;
  }>;
}

export const PersonalSection = ({ form, specialties }: PersonalSectionProps) => {
  const pessoaTipo = form.watch('pessoa_tipo');

  console.log('PersonalSection rendered with specialties:', {
    count: specialties?.length || 0,
    specialtiesList: specialties,
    firstSpecialty: specialties?.[0]
  });

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="pessoa_tipo"
        rules={{ required: "Tipo de pessoa é obrigatório" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Pessoa</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de pessoa" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="fisica">Pessoa Física</SelectItem>
                <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {pessoaTipo === 'fisica' ? (
        <PhysicalPersonFields form={form} />
      ) : (
        <LegalPersonFields form={form} />
      )}

      <ProfessionalFields form={form} specialties={specialties} />
    </div>
  );
};
