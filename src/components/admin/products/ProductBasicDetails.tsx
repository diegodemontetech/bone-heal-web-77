
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

const ProductBasicDetails = ({ form }: { form: any }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informações Básicas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <FormControl>
                <Input placeholder="Nome do produto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug (URL)</FormLabel>
              <FormControl>
                <Input placeholder="slug-do-produto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="omie_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código OMIE</FormLabel>
              <FormControl>
                <Input placeholder="Código do produto no OMIE" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso (kg)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <h3 className="text-lg font-medium mt-6">Categorias</h3>
      <div className="space-y-2">
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value?.includes("cicatrizacao-rapida")}
                  onCheckedChange={(checked) => {
                    const currentValue = [...field.value || []];
                    if (checked) {
                      field.onChange([...currentValue, "cicatrizacao-rapida"]);
                    } else {
                      field.onChange(currentValue.filter(v => v !== "cicatrizacao-rapida"));
                    }
                  }}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                Cicatrização Mais Rápida
              </FormLabel>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value?.includes("cicatrizacao-normal")}
                  onCheckedChange={(checked) => {
                    const currentValue = [...field.value || []];
                    if (checked) {
                      field.onChange([...currentValue, "cicatrizacao-normal"]);
                    } else {
                      field.onChange(currentValue.filter(v => v !== "cicatrizacao-normal"));
                    }
                  }}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                Cicatrização Normal
              </FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ProductBasicDetails;
