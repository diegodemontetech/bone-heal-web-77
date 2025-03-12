
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../RegistrationForm";
import { states } from "@/utils/states";
import { fetchAddressFromCep } from "@/utils/address";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddressFormSectionProps {
  form: UseFormReturn<FormData>;
}

const AddressFormSection: React.FC<AddressFormSectionProps> = ({ form }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<string[]>([]);

  const handleCepSearch = async () => {
    const cep = form.getValues('zipCode').replace(/\D/g, '');
    
    if (cep.length !== 8) {
      toast.error("CEP inválido. Informe um CEP com 8 dígitos.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const addressData = await fetchAddressFromCep(cep);
      
      if (addressData) {
        form.setValue('address', addressData.logradouro || '');
        form.setValue('neighborhood', addressData.bairro || '');
        form.setValue('city', addressData.localidade || '');
        form.setValue('state', addressData.uf || '');
        
        toast.success("Endereço encontrado com sucesso!");
      } else {
        toast.error("CEP não encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast.error("Erro ao buscar CEP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStateChange = async (value: string) => {
    form.setValue('state', value);
    form.setValue('city', '');
    
    // Em um cenário real, buscaríamos as cidades do estado selecionado
    // Aqui podemos implementar posteriormente, por enquanto deixar como campo aberto
    setCities([]);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input 
                    placeholder="00000000" 
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      field.onChange(value);
                    }}
                    maxLength={8}
                  />
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={handleCepSearch}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Logradouro</FormLabel>
            <FormControl>
              <Input placeholder="Rua, Avenida..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="endereco_numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input placeholder="Número" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="complemento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input placeholder="Complemento (opcional)" {...field} />
              </FormControl>
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
              <Input placeholder="Seu bairro" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select 
                onValueChange={handleStateChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input placeholder="Sua cidade" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default AddressFormSection;
