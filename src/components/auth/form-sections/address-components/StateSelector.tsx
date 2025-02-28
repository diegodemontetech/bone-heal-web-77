
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData } from "../../RegistrationForm";

interface StateSelectorProps {
  form: UseFormReturn<FormData>;
  states: Array<{ id: number; uf: string; name: string }>;
}

export const StateSelector = ({ form, states }: StateSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="state"
      rules={{ required: "Estado é obrigatório" }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Estado</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              // Reset city when state changes
              form.setValue('city', '');
            }} 
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
  );
};
