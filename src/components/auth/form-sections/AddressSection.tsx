
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AddressSectionProps {
  form: UseFormReturn<any>;
}

export const AddressSection = ({ form }: AddressSectionProps) => {
  const { data: states } = useQuery({
    queryKey: ['ibge-states'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ibge_states')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedZipCode = e.target.value.replace(/\D/g, '').substring(0, 8);
    form.setValue('zipCode', formattedZipCode);
  };

  return (
    <>
      <FormField
        control={form.control}
        name="address"
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

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {states?.map((state) => (
                    <SelectItem key={state.id} value={state.uf}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="neighborhood"
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
        render={({ field }) => (
          <FormItem>
            <FormLabel>CEP</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                onChange={handleZipCodeChange}
                maxLength={8}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
