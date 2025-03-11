
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
import { Checkbox } from "@/components/ui/checkbox";

export interface FilterValues {
  categories: string[];
  sortBy?: string;
}

interface ProductFiltersProps {
  onFilterChange: (values: FilterValues) => void;
  initialValues: FilterValues;
}

// Definindo o schema para garantir que seja compatível com a interface FilterValues
const filterSchema = z.object({
  categories: z.array(z.string()).min(1, "Selecione pelo menos uma categoria"),
  sortBy: z.string().optional(),
});

// Tipo compatível com FilterValues
type FilterFormValues = z.infer<typeof filterSchema>;

const categoryOptions = [
  { id: "todos", label: "Todos" },
  { id: "cicatrizacao-rapida", label: "Cicatrização Mais Rápida" },
  { id: "cicatrizacao-normal", label: "Cicatrização Normal" }
];

export function ProductFilters({ onFilterChange, initialValues }: ProductFiltersProps) {
  // Usando o tipo correto para o formulário
  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: initialValues,
  });

  // Função de submissão com tipo explícito
  const onSubmit = (data: FilterValues) => {
    onFilterChange(data);
  };

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormLabel className="text-base">Categorias</FormLabel>
          {categoryOptions.map((option) => (
            <FormField
              key={option.id}
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(option.id)}
                      onCheckedChange={(checked) => {
                        const currentValue = [...field.value || []];
                        
                        if (option.id === "todos") {
                          // Se marcando "Todos", desmarca os outros
                          if (checked) {
                            field.onChange(["todos"]);
                          } else {
                            field.onChange(["todos"]); // Garantir que sempre tem pelo menos "todos" selecionado
                          }
                        } else {
                          // Se marcando uma categoria específica, desmarca "Todos"
                          const withoutTodos = currentValue.filter(v => v !== "todos");
                          
                          if (checked) {
                            field.onChange([...withoutTodos, option.id]);
                          } else {
                            const newValue = withoutTodos.filter(v => v !== option.id);
                            // Se não sobrar nenhuma categoria, selecionar "todos"
                            field.onChange(newValue.length > 0 ? newValue : ["todos"]);
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    {option.label}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </form>
    </Form>
  );
}
