
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
import { Loader2 } from "lucide-react";

interface StateAndCitySelectorProps {
  form: UseFormReturn<FormData>;
}

export const StateAndCitySelector = ({ form }: StateAndCitySelectorProps) => {
  // Fetch states with better error handling and loading state
  const { data: states = [], isLoading: loadingStates } = useQuery({
    queryKey: ['ibge-states'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ibge_states')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching states:', error);
        throw error;
      }
      return data || [];
    }
  });

  const selectedState = form.watch('state');

  // Fetch cities based on selected state
  const { data: cities = [], isLoading: loadingCities } = useQuery({
    queryKey: ['ibge-cities', selectedState],
    queryFn: async () => {
      if (!selectedState) return [];

      const selectedStateData = states.find(s => s.uf === selectedState);
      if (!selectedStateData) return [];

      const { data, error } = await supabase
        .from('ibge_cities')
        .select('*')
        .eq('state_id', selectedStateData.id)
        .order('name');
      
      if (error) {
        console.error('Error fetching cities:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!selectedState
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              disabled={loadingStates}
            >
              <FormControl>
                <SelectTrigger className="bg-white border-purple-200 focus:ring-purple-500">
                  <SelectValue placeholder={loadingStates ? "Carregando estados..." : "Selecione o estado"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {loadingStates ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  states.map(state => (
                    <SelectItem 
                      key={state.id} 
                      value={state.uf}
                      className="hover:bg-purple-50"
                    >
                      {state.name}
                    </SelectItem>
                  ))
                )}
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
              disabled={!selectedState || loadingCities}
            >
              <FormControl>
                <SelectTrigger className="bg-white border-purple-200 focus:ring-purple-500">
                  <SelectValue 
                    placeholder={
                      loadingCities 
                        ? "Carregando cidades..." 
                        : selectedState 
                          ? "Selecione a cidade" 
                          : "Selecione primeiro o estado"
                    } 
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {loadingCities ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  cities.map((city) => (
                    <SelectItem 
                      key={city.id} 
                      value={city.name}
                      className="hover:bg-purple-50"
                    >
                      {city.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
