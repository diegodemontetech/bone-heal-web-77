
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../../RegistrationForm";

interface AddressAndComplementProps {
  form: UseFormReturn<FormData>;
}

export const AddressAndComplement = ({ form }: AddressAndComplementProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="address"
        rules={{ required: "Endereço é obrigatório" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="complement"
        render={({ field: { value, ...fieldProps } }) => (
          <FormItem>
            <FormLabel>Número / Complemento</FormLabel>
            <FormControl>
              <Input 
                {...fieldProps}
                value={typeof value === 'string' ? value : ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
