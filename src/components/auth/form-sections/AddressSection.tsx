
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

interface AddressSectionProps {
  form: UseFormReturn<any>;
  cities: Array<{
    id: number;
    omie_code: string;
    name: string;
    state: string;
  }>;
}

export const AddressSection = ({ form, cities }: AddressSectionProps) => {
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
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estado</FormLabel>
            <Select onValueChange={(value) => {
              field.onChange(value);
              // Reset city when state changes
              form.setValue('city', '');
              form.setValue('omie_city_code', '');
            }} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {[...new Set(cities.map(city => city.state))].sort().map(state => (
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
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
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
        render={({ field }) => (
          <FormItem>
            <FormLabel>CEP</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                onChange={handleZipCodeChange}
                maxLength={8}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
</lov-code>

Agora precisamos atualizar os campos de contato para incluir o DDD e número separadamente conforme exigido pelo Omie. Vou fazer isso:

<lov-code>
<lov-write file_path="src/components/auth/form-sections/ContactSection.tsx">
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

interface ContactSectionProps {
  form: UseFormReturn<any>;
}

export const ContactSection = ({ form }: ContactSectionProps) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value.replace(/\D/g, '');
    if (field === 'telefone1_ddd') {
      form.setValue('telefone1_ddd', value.substring(0, 2));
    } else {
      form.setValue('telefone1_numero', value.substring(0, 9));
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name="telefone1_ddd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DDD</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  onChange={(e) => handlePhoneChange(e, 'telefone1_ddd')}
                  maxLength={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telefone1_numero"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  onChange={(e) => handlePhoneChange(e, 'telefone1_numero')}
                  maxLength={9}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="receiveNews"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Desejo receber novidades
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};
