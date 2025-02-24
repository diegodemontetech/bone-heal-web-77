
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

interface NeighborhoodAndZipCodeProps {
  form: UseFormReturn<FormData>;
}

export const NeighborhoodAndZipCode = ({ form }: NeighborhoodAndZipCodeProps) => {
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedZipCode = e.target.value.replace(/\D/g, '').substring(0, 8);
    form.setValue('zipCode', formattedZipCode);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="neighborhood"
          rules={{ required: "Bairro é obrigatório" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
      </div>
    </>
  );
};
