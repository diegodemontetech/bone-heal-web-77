
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { StageFormValues } from "@/types/crm";

interface OrderInputProps {
  form: UseFormReturn<StageFormValues>;
}

export function OrderInput({ form }: OrderInputProps) {
  return (
    <FormField
      control={form.control}
      name="order"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ordem</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              min="1"
              placeholder="Ordem de exibição"
              {...field} 
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              value={field.value || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
