
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../RegistrationForm";
import { fetchAddressFromCep } from "@/utils/address";
import { Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";

interface AddressFormSectionProps {
  form: UseFormReturn<FormData>;
}

const AddressFormSection: React.FC<AddressFormSectionProps> = ({ form }) => {
  const [addressLoading, setAddressLoading] = useState(false);

  const handleCepBlur = async (cep: string) => {
    if (cep.length === 8) {
      setAddressLoading(true);
      try {
        const addressData = await fetchAddressFromCep(cep);
        if (addressData) {
          form.setValue('address', addressData.logradouro || '');
          form.setValue('neighborhood', addressData.bairro || '');
          form.setValue('city', addressData.localidade || '');
          form.setValue('state', addressData.uf || '');
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
    <>
      <FormField
        control={form.control}
        name="zipCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CEP</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  placeholder="00000000" 
                  {...field} 
                  onBlur={(e) => handleCepBlur(e.target.value.replace(/\D/g, ''))}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    field.onChange(value);
                  }}
                  maxLength={8}
                />
                {addressLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
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
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  placeholder="Rua, Avenida..." 
                  {...field} 
                  readOnly 
                  className="bg-gray-100" 
                />
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Seu bairro" 
                  {...field} 
                  readOnly 
                  className="bg-gray-100" 
                />
              </FormControl>
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
                <Input 
                  placeholder="Sua cidade" 
                  {...field} 
                  readOnly 
                  className="bg-gray-100" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estado</FormLabel>
            <FormControl>
              <Input 
                placeholder="UF" 
                {...field} 
                readOnly 
                className="bg-gray-100" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AddressFormSection;
