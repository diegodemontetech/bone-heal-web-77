
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
import { formatZipCode } from "../utils/zipCodeUtils";

interface ZipCodeFieldProps {
  form: UseFormReturn<FormData>;
}

export const ZipCodeField = ({ form }: ZipCodeFieldProps) => {
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedZipCode = formatZipCode(e.target.value);
    form.setValue('zipCode', formattedZipCode);
  };

  return (
    <FormField
      control={form.control}
      name="zipCode"
      rules={{ 
        required: "CEP é obrigatório",
        pattern: {
          value: /^\d{8}$/,
          message: "CEP deve conter 8 dígitos"
        }
      }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>CEP</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              onChange={handleZipCodeChange}
              maxLength={8}
              placeholder="00000000"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
