
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
import { FormData } from "../../RegistrationForm";

interface City {
  id: number;
  omie_code: string;
  name: string;
  state: string;
}

interface CityFieldsProps {
  form: UseFormReturn<FormData>;
  cities: City[];
  selectedState: string;
}

export const CityFields = ({ form, cities, selectedState }: CityFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="city"
        rules={{ required: "Cidade é obrigatória" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cidade</FormLabel>
            <Select 
              onValueChange={field.onChange}
              value={field.value}
              disabled={!selectedState}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={selectedState ? "Selecione a cidade" : "Selecione primeiro o estado"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {cities.map((city) => (
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
  );
};
