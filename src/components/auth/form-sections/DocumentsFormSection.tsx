
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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Documentos Fiscais</h2>
      
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
        <div className="space-y-4">
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
          
          <h3 className="text-md font-medium mt-4">Dados do Responsável Técnico</h3>
          
          <FormField
            control={form.control}
            name="responsavel_tecnico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Responsável Técnico</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo do responsável técnico" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cpf_responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF do Responsável Técnico</FormLabel>
                  <FormControl>
                    <Input placeholder="CPF do responsável" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cro_responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CRO do Responsável Técnico</FormLabel>
                  <FormControl>
                    <Input placeholder="CRO do responsável" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="epao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>EPAO</FormLabel>
                <FormControl>
                  <Input placeholder="EPAO" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentsFormSection;
