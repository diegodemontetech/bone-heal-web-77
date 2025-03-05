
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../RegistrationForm";
import { dentistSpecialties } from "@/utils/specialties";

interface ProfessionalFormSectionProps {
  form: UseFormReturn<FormData>;
}

const ProfessionalFormSection: React.FC<ProfessionalFormSectionProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="cro"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CRO</FormLabel>
            <FormControl>
              <Input placeholder="Número do seu CRO" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua especialidade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {dentistSpecialties.map((specialty) => (
                  <SelectItem key={specialty.value} value={specialty.value}>
                    {specialty.label}
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
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <Input placeholder="(XX) XXXX-XXXX" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProfessionalFormSection;
