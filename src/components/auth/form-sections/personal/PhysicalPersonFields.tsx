
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface PhysicalPersonFieldsProps {
  form: UseFormReturn<any>;
}

export const PhysicalPersonFields = ({ form }: PhysicalPersonFieldsProps) => {
  return (
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
  );
};
