import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryFormSchema, CategoryFormValues } from "@/validators/product-schema";
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
import { ProductDepartment } from "@/types/product";

interface CategoryFormProps {
  category?: any;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CategoryForm({ category, open, onClose, onSuccess }: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<ProductDepartment[]>([]);
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || "",
      department_id: category?.department_id || "",
      description: category?.description || "",
    }
  });

  useEffect(() => {
    async function loadDepartments() {
      try {
        const { data, error } = await supabase
          .from("product_departments")
          .select("*")
          .order("name");
          
        if (error) throw error;
        setDepartments(data || []);
      } catch (error) {
        console.error("Erro ao carregar departamentos:", error);
      }
    }
    
    loadDepartments();
  }, []);

  async function onSubmit(values: CategoryFormValues) {
    try {
      setIsLoading(true);
      
      if (category) {
        // Atualizar categoria existente
        const { error } = await supabase
          .from("product_categories")
          .update({
            name: values.name, // Garantir que name não seja opcional
            department_id: values.department_id,
            description: values.description
          })
          .eq("id", category.id);
          
        if (error) throw error;
        toast.success("Categoria atualizada com sucesso");
      } else {
        // Criar nova categoria
        const { error } = await supabase
          .from("product_categories")
          .insert({
            name: values.name, // Garantir que name não seja opcional
            department_id: values.department_id,
            description: values.description
          });
          
        if (error) throw error;
        toast.success("Categoria criada com sucesso");
      }
      
      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao salvar categoria:", error);
      toast.error(`Erro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{category ? "Editar" : "Nova"} Categoria</DialogTitle>
          <DialogDescription>
            {category ? "Atualize os detalhes da categoria" : "Crie uma nova categoria para organizar seus produtos"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="department_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um departamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
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
                    <Input placeholder="Nome da categoria" {...field} />
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
                    <Textarea placeholder="Descrição da categoria" {...field} />
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
                {category ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
