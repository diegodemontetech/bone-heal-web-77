
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
import { FormData } from "../RegistrationForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AddressSectionProps {
  form: UseFormReturn<FormData>;
  cities: Array<{
    id: number;
    omie_code: string;
    name: string;
    state: string;
  }>;
}

export const AddressSection = ({ form, cities }: AddressSectionProps) => {
  // Get unique states from cities array
  const states = [...new Set(cities.map(city => city.state))].sort();
  
  const selectedState = form.watch('state');
  const filteredCities = cities.filter(city => city.state === selectedState);

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedZipCode = e.target.value.replace(/\D/g, '').substring(0, 8);
    form.setValue('zipCode', formattedZipCode);
  };

  return (
    <>
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
          name="endereco_numero"
          rules={{ required: "Número é obrigatório" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="state"
        rules={{ required: "Estado é obrigatório" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estado</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                // Reset city when state changes
                form.setValue('city', '');
                form.setValue('omie_city_code', '');
              }} 
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {states.map(state => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="city"
          rules={{ required: "Cidade é obrigatória" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <Select 
                onValueChange={(value) => {
                  const selectedCity = filteredCities.find(city => city.name === value);
                  field.onChange(value);
                  if (selectedCity) {
                    form.setValue('omie_city_code', selectedCity.omie_code);
                  }
                }} 
                value={field.value}
                disabled={!selectedState}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedState ? "Selecione a cidade" : "Selecione primeiro o estado"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredCities.map((city) => (
                    <SelectItem key={city.id} value={city.name}>
                      {city.name}
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
      </div>

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
    </>
  );
};

export default AddressSection;
