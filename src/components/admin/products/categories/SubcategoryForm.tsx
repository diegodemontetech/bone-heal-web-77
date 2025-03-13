import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subcategoryFormSchema, SubcategoryFormValues } from "@/validators/product-schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ProductCategory } from "@/types/product";
import { parseJsonObject, stringifyForSupabase } from "@/utils/supabaseJsonUtils";

interface SubcategoryFormProps {
  subcategory?: any;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cloneFrom?: string;
}

export function SubcategoryForm({ subcategory, open, onClose, onSuccess, cloneFrom }: SubcategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  
  const form = useForm<SubcategoryFormValues>({
    resolver: zodResolver(subcategoryFormSchema),
    defaultValues: {
      name: subcategory?.name || "",
      category_id: subcategory?.category_id || "",
      description: subcategory?.description || "",
      default_fields: subcategory?.default_fields ? parseJsonObject(subcategory.default_fields, {}) : {},
    }
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const { data, error } = await supabase
          .from("product_categories")
          .select("*")
          .order("name");
          
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }
    
    loadCategories();
  }, []);

  useEffect(() => {
    if (cloneFrom && !subcategory) {
      async function loadCloneData() {
        try {
          const { data, error } = await supabase
            .from("product_subcategories")
            .select("*")
            .eq("id", cloneFrom)
            .single();
            
          if (error) throw error;
          
          if (data) {
            form.setValue("category_id", data.category_id);
            form.setValue("description", data.description || "");
            form.setValue("default_fields", parseJsonObject(data.default_fields, {}));
          }
        } catch (error) {
          console.error("Erro ao carregar dados para clonar:", error);
        }
      }
      
      loadCloneData();
    }
  }, [cloneFrom, form, subcategory]);

  async function onSubmit(values: SubcategoryFormValues) {
    try {
      setIsLoading(true);
      
      // Converter default_fields de Record<string, any> para Json
      const formattedValues = {
        name: values.name,
        category_id: values.category_id,
        description: values.description,
        default_fields: stringifyForSupabase(values.default_fields)
      };
      
      if (subcategory) {
        // Atualizar subcategoria existente
        const { error } = await supabase
          .from("product_subcategories")
          .update(formattedValues)
          .eq("id", subcategory.id);
          
        if (error) throw error;
        toast.success("Subcategoria atualizada com sucesso");
      } else {
        // Criar nova subcategoria
        const { error } = await supabase
          .from("product_subcategories")
          .insert(formattedValues);
          
        if (error) throw error;
        toast.success("Subcategoria criada com sucesso");
      }
      
      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao salvar subcategoria:", error);
      toast.error(`Erro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {subcategory ? "Editar" : cloneFrom ? "Clonar" : "Nova"} Subcategoria
          </DialogTitle>
          <DialogDescription>
            {subcategory 
              ? "Atualize os detalhes da subcategoria" 
              : cloneFrom 
                ? "Clone uma subcategoria existente com suas configurações"
                : "Crie uma nova subcategoria para organizar seus produtos"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category_id"
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
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da subcategoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição da subcategoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {subcategory ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
