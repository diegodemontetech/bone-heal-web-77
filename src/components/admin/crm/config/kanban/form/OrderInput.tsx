
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface StageFormValues {
  name: string;
  color: string;
  department_id: string;
  order: number;
}

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
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
