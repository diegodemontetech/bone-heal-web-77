import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useViaCep } from "react-use-viacep";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { City } from "@/types/city";

// Função para converter cidades para o formato correto
const mapToCityFormat = (cities: any[]): City[] => {
  return cities.map(city => ({
    id: city.id,
    name: city.name,
    state_id: city.state_id,
    state: city.state || "",
    ibge_code: city.ibge_code || "",
    omie_code: city.omie_code || ""
  }));
};

// Componente AddressSection
const AddressSection = ({ }) => {
  const { register, setValue, watch } = useFormContext();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState<City[]>([]);
  const zipCode = watch("address.zip_code");
  const selectedState = watch("address.state");

  const { cep, result, search, error, loading } = useViaCep();

  useEffect(() => {
    if (zipCode && zipCode.length === 8) {
      search(zipCode);
    }
  }, [zipCode, search]);

  useEffect(() => {
    if (result) {
      setValue("address.city", result.localidade);
      setValue("address.neighborhood", result.bairro);
      setValue("address.state", result.uf);
      setValue("address.address", result.logradouro);
    }
  }, [result, setValue]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const { data, error } = await supabase
          .from('states')
          .select('*')
          .order('name');

        if (error) throw error;
        setStates(data);
      } catch (error) {
        console.error('Erro ao buscar estados:', error);
        toast.error('Erro ao buscar estados');
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchCities(selectedState);
    }
  }, [selectedState]);

  // Atualização da busca de cidades para garantir o formato correto
  const fetchCities = async (stateId) => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('state_id', stateId)
        .order('name');
        
      if (error) throw error;
      
      // Converter os dados para o formato City
      setCities(mapToCityFormat(data || []));
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="zip_code">CEP</Label>
        <Input
          id="zip_code"
          type="text"
          maxLength={8}
          {...register("address.zip_code")}
        />
        {loading && <p>Buscando CEP...</p>}
        {error && <p className="text-red-500">CEP inválido</p>}
      </div>
      <div>
        <Label htmlFor="address">Endereço</Label>
        <Input id="address" type="text" {...register("address.address")} />
      </div>
      <div>
        <Label htmlFor="number">Número</Label>
        <Input id="number" type="text" {...register("address.number")} />
      </div>
      <div>
        <Label htmlFor="complement">Complemento</Label>
        <Input id="complement" type="text" {...register("address.complement")} />
      </div>
      <div>
        <Label htmlFor="neighborhood">Bairro</Label>
        <Input id="neighborhood" type="text" {...register("address.neighborhood")} />
      </div>
      <div>
        <Label htmlFor="state">Estado</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um estado" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state: any) => (
              <SelectItem key={state.id} value={state.id.toString()}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register("address.state")} />
      </div>
      <div>
        <Label htmlFor="city">Cidade</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma cidade" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register("address.city")} />
      </div>
    </div>
  );
};

export default AddressSection;
