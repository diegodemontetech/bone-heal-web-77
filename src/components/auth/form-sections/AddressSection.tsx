
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { fetchAddressFromCep } from "@/utils/address";
import { Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { parseJsonArray } from "@/utils/supabaseJsonUtils";

interface AddressSectionProps {
  formData: {
    zip_code: string;
    address: string;
    endereco_numero: string;
    complemento: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  setFormData,
}) => {
  const [addressLoading, setAddressLoading] = useState(false);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    // Carregar estados
    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        // Usando a tabela omie_cities que deve ter os estados
        const { data, error } = await supabase
          .from('states')
          .select('*')
          .order('name', { ascending: true });
          
        if (error) {
          console.error('Erro ao buscar estados:', error);
          return;
        }
        
        setStates(data || []);
      } catch (error) {
        console.error('Erro ao buscar estados:', error);
      } finally {
        setLoadingStates(false);
      }
    };
    
    fetchStates();
  }, []);

  useEffect(() => {
    // Carregar cidades quando o estado for selecionado
    const fetchCities = async () => {
      if (!formData.state) return;
      
      setLoadingCities(true);
      try {
        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .eq('state_id', formData.state)
          .order('name', { ascending: true });
          
        if (error) {
          console.error('Erro ao buscar cidades:', error);
          return;
        }
        
        setCities(data || []);
      } catch (error) {
        console.error('Erro ao buscar cidades:', error);
      } finally {
        setLoadingCities(false);
      }
    };
    
    fetchCities();
  }, [formData.state]);

  const handleCepBlur = async (cep: string) => {
    if (cep.length === 8) {
      setAddressLoading(true);
      try {
        const addressData = await fetchAddressFromCep(cep);
        if (addressData) {
          setFormData(prev => ({
            ...prev,
            address: addressData.logradouro || prev.address,
            neighborhood: addressData.bairro || prev.neighborhood,
            city: addressData.localidade || prev.city,
            state: addressData.uf || prev.state,
          }));
          toast.success("Endereço encontrado com sucesso!");
        }
      } catch (error) {
        console.error('Erro ao buscar endereço:', error);
        toast.error("Não foi possível encontrar o endereço para este CEP");
      } finally {
        setAddressLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="zip_code">CEP</Label>
        <div className="relative">
          <Input
            id="zip_code"
            name="zip_code"
            value={formData.zip_code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setFormData(prev => ({ ...prev, zip_code: value }));
            }}
            maxLength={8}
            onBlur={(e) => handleCepBlur(e.target.value)}
            placeholder="Digite apenas números"
          />
          {addressLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <div className="relative">
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            readOnly
            className="bg-gray-100"
          />
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="endereco_numero">Número</Label>
          <Input
            id="endereco_numero"
            name="endereco_numero"
            value={formData.endereco_numero}
            onChange={handleChange}
            placeholder="Número"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="complemento">Complemento</Label>
          <Input
            id="complemento"
            name="complemento"
            value={formData.complemento}
            onChange={handleChange}
            placeholder="Apartamento, bloco, etc."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            id="neighborhood"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleChange}
            readOnly
            className="bg-gray-100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            readOnly
            className="bg-gray-100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="state">Estado</Label>
        <div className="relative">
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            readOnly
            className="bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
