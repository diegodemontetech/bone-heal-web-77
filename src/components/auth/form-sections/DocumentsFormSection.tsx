
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../RegistrationForm";

interface DocumentsFormSectionProps {
  form: UseFormReturn<FormData>;
}

const DocumentsFormSection: React.FC<DocumentsFormSectionProps> = ({ form }) => {
  const pessoaTipo = form.watch('pessoa_tipo');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {pessoaTipo === 'fisica' ? (
        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input placeholder="Seu CPF" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <Input placeholder="CNPJ da empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default DocumentsFormSection;
