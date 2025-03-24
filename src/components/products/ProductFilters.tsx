
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterValues {
  sortBy?: string;
}

interface ProductFiltersProps {
  onFilterChange: (values: FilterValues) => void;
  initialValues: FilterValues;
}

// Definindo o schema Zod para garantir que seja compatível com FilterValues
const filterSchema = z.object({
  sortBy: z.string().optional(),
});

// Usando o tipo do schema para garantir compatibilidade
type FilterFormValues = z.infer<typeof filterSchema>;

export function ProductFilters({ onFilterChange, initialValues }: ProductFiltersProps) {
  // Usando FilterFormValues que é compatível com FilterValues
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      sortBy: initialValues.sortBy
    },
  });

  const onSubmit = (data: FilterFormValues) => {
    // Validação simplificada sem categorias
    const validatedData: FilterValues = {
      sortBy: data.sortBy
    };
    onFilterChange(validatedData);
  };

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormLabel className="text-base">Ordenar por</FormLabel>
          <FormField
            control={form.control}
            name="sortBy"
            render={({ field }) => (
              <FormItem>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
                    <SelectItem value="price-asc">Preço (menor para maior)</SelectItem>
                    <SelectItem value="price-desc">Preço (maior para menor)</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
