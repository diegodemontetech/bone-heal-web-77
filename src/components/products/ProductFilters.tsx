
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export interface FilterValues {
  search: string;
  priceRange: number[];
  category: string;
  sortBy: string;
}

interface ProductFiltersProps {
  onFilterChange: (values: FilterValues) => void;
  initialValues: FilterValues;
}

const filterSchema = z.object({
  search: z.string(),
  priceRange: z.array(z.number()),
  category: z.string(),
  sortBy: z.string(),
});

export function ProductFilters({ onFilterChange, initialValues }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState(initialValues.priceRange);

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: initialValues,
  });

  const onSubmit = (data: FilterValues) => {
    onFilterChange({ ...data, priceRange });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buscar</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do produto..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label>Faixa de Preço</Label>
          <Slider
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>R$ {priceRange[0]}</span>
            <span>R$ {priceRange[1]}</span>
          </div>
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <ScrollArea className="h-72">
                    <SelectItem value="membranas">Membranas</SelectItem>
                    <SelectItem value="enxertos">Enxertos</SelectItem>
                    <SelectItem value="instrumentais">Instrumentais</SelectItem>
                  </ScrollArea>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sortBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ordenar por</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
                  <SelectItem value="price-asc">Menor preço</SelectItem>
                  <SelectItem value="price-desc">Maior preço</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Aplicar Filtros
        </Button>
      </form>
    </Form>
  );
}
