
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
        name="specialty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Especialidade</FormLabel>
            <Select 
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="w-full">
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
        name="cro"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CRO</FormLabel>
            <FormControl>
              <Input placeholder="Seu número de CRO" {...field} />
            </FormControl>
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
              <Input 
                placeholder="(00) 00000-0000" 
                {...field} 
                onChange={(e) => {
                  // Máscara de telefone melhorada
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length > 11) value = value.slice(0, 11);
                  
                  // Aplicar máscara para celular (11 dígitos) ou telefone fixo (10 dígitos)
                  if (value.length > 2) {
                    if (value.length > 7) {
                      // Para números com formato (XX) XXXXX-XXXX (celular)
                      if (value.length >= 11) {
                        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
                      } 
                      // Para números com formato (XX) XXXX-XXXX (fixo)
                      else if (value.length >= 10) {
                        value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6, 10)}`;
                      }
                      // Para números incompletos
                      else if (value.length > 6) {
                        value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
                      } else {
                        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                      }
                    } else {
                      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                    }
                  }
                  
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProfessionalFormSection;
