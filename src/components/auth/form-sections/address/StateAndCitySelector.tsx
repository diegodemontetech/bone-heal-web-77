
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FormData } from "../../RegistrationForm";

interface StateAndCitySelectorProps {
  form: UseFormReturn<FormData>;
}

export const StateAndCitySelector = ({ form }: StateAndCitySelectorProps) => {
  // Fetch states
  const { data: states = [] } = useQuery({
    queryKey: ['ibge-states'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ibge_states')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const selectedState = form.watch('state');

  // Fetch cities based on selected state
  const { data: cities = [] } = useQuery({
    queryKey: ['ibge-cities', selectedState],
    queryFn: async () => {
      const selectedStateData = states.find(s => s.uf === selectedState);
      if (!selectedStateData) return [];

      const { data, error } = await supabase
        .from('ibge_cities')
        .select('*')
        .eq('state_id', selectedStateData.id)
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedState
  });

  return (
    <>
      <FormField
        control={form.control}
        name="state"
        rules={{ required: "Estado é obrigatório" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estado</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {states.map(state => (
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
    </>
  );
};
