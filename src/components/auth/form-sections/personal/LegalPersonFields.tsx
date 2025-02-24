
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface LegalPersonFieldsProps {
  form: UseFormReturn<any>;
}

export const LegalPersonFields = ({ form }: LegalPersonFieldsProps) => {
  return (
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
    </>
  );
};
