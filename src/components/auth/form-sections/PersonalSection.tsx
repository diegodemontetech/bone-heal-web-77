
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

  return (
    <>
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
        <>
          <FormField
            control={form.control}
            name="fullName"
            rules={{ required: "Nome completo é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cpf"
            rules={{ 
              required: "CPF é obrigatório",
              pattern: {
                value: /^\d{11}$/,
                message: "CPF deve conter 11 dígitos"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ) : (
        <>
          <FormField
            control={form.control}
            name="razao_social"
            rules={{ required: "Razão Social é obrigatória" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razão Social</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nome_fantasia"
            rules={{ required: "Nome Fantasia é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Fantasia</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cnpj"
            rules={{ 
              required: "CNPJ é obrigatório",
              pattern: {
                value: /^\d{14}$/,
                message: "CNPJ deve conter 14 dígitos"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="responsavel_tecnico"
            rules={{ required: "Nome do Responsável Técnico é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Responsável Técnico</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cpf_responsavel"
            rules={{ 
              required: "CPF do Responsável Técnico é obrigatório",
              pattern: {
                value: /^\d{11}$/,
                message: "CPF deve conter 11 dígitos"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF do Responsável Técnico</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cro_responsavel"
            rules={{ required: "CRO do Responsável Técnico é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>CRO do Responsável Técnico</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="epao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>EPAO</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      <FormField
        control={form.control}
        name="specialty"
        rules={{ required: "Especialidade é obrigatória" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Especialidade</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma especialidade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {specialties && specialties.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.name}>
                    {specialty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
