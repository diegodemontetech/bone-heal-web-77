
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
import { FormData } from "../../types/registration-form";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface StateAndCitySelectorProps {
  form: UseFormReturn<FormData>;
}

export const StateAndCitySelector = ({ form }: StateAndCitySelectorProps) => {
  // Fetch states with better error handling and loading state
  const { data: states = [], isLoading: loadingStates, error: statesError } = useQuery({
    queryKey: ['ibge-states'],
    queryFn: async () => {
      console.log('Fetching states...');
      const { data, error } = await supabase
        .from('ibge_states')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching states:', error);
        throw error;
      }
      console.log('States fetched:', data);
      return data || [];
    }
  });

  const selectedState = form.watch('state');

  // Fetch cities based on selected state
  const { data: cities = [], isLoading: loadingCities, error: citiesError } = useQuery({
    queryKey: ['ibge-cities', selectedState],
    queryFn: async () => {
      if (!selectedState) return [];
      console.log('Fetching cities for state:', selectedState);

      const selectedStateData = states.find(s => s.uf === selectedState);
      if (!selectedStateData) {
        console.log('No state data found for:', selectedState);
        return [];
      }

      const { data, error } = await supabase
        .from('ibge_cities')
        .select('*')
        .eq('state_id', selectedStateData.id)
        .order('name');
      
      if (error) {
        console.error('Error fetching cities:', error);
        throw error;
      }
      console.log('Cities fetched:', data);
      return data || [];
    },
    enabled: !!selectedState && states.length > 0
  });

  useEffect(() => {
    if (statesError) {
      console.error('States fetch error:', statesError);
    }
    if (citiesError) {
      console.error('Cities fetch error:', citiesError);
    }
  }, [statesError, citiesError]);

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
              <SelectContent className="bg-white max-h-[300px]">
                {loadingStates ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : statesError ? (
                  <div className="p-2 text-red-500 text-sm">Erro ao carregar estados</div>
                ) : states.length === 0 ? (
                  <div className="p-2 text-gray-500 text-sm">Nenhum estado encontrado</div>
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
              <SelectContent className="bg-white max-h-[300px]">
                {loadingCities ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : citiesError ? (
                  <div className="p-2 text-red-500 text-sm">Erro ao carregar cidades</div>
                ) : !selectedState ? (
                  <div className="p-2 text-gray-500 text-sm">Selecione um estado primeiro</div>
                ) : cities.length === 0 ? (
                  <div className="p-2 text-gray-500 text-sm">Nenhuma cidade encontrada</div>
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
