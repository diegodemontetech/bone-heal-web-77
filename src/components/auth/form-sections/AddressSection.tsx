
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../RegistrationForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddressFields } from "./address-components/AddressFields";
import { StateSelector } from "./address-components/StateSelector";
import { CityFields } from "./address-components/CityFields";
import { ZipCodeField } from "./address-components/ZipCodeField";

interface City {
  id: number;
  omie_code: string;
  name: string;
  state: string;
}

interface AddressSectionProps {
  form: UseFormReturn<FormData>;
  cities?: City[];
}

export const AddressSection = ({ form, cities = [] }: AddressSectionProps) => {
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
  const { data: fetchedCities = [] } = useQuery({
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

  // Use provided cities or fetched cities
  const availableCities = cities.length > 0 ? cities : fetchedCities;

  return (
    <>
      <AddressFields form={form} />
      <StateSelector form={form} states={states} />
      <CityFields 
        form={form} 
        cities={availableCities} 
        selectedState={selectedState} 
      />
      <ZipCodeField form={form} />
    </>
  );
};

export default AddressSection;
