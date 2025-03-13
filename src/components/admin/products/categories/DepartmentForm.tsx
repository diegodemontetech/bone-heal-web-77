import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { departmentFormSchema, DepartmentFormValues } from "@/validators/product-schema";
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
import { Loader2 } from "lucide-react";

interface DepartmentFormProps {
  department?: any;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DepartmentForm({ department, open, onClose, onSuccess }: DepartmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: department?.name || "",
      description: department?.description || "",
    }
  });

  async function onSubmit(values: DepartmentFormValues) {
    try {
      setIsLoading(true);
      
      if (department) {
        // Atualizar departamento existente
        const { error } = await supabase
          .from("product_departments")
          .update({
            name: values.name, // Garantir que name não seja opcional
            description: values.description
          })
          .eq("id", department.id);
          
        if (error) throw error;
        toast.success("Departamento atualizado com sucesso");
      } else {
        // Criar novo departamento
        const { error } = await supabase
          .from("product_departments")
          .insert({
            name: values.name, // Garantir que name não seja opcional
            description: values.description
          });
          
        if (error) throw error;
        toast.success("Departamento criado com sucesso");
      }
      
      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao salvar departamento:", error);
      toast.error(`Erro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{department ? "Editar" : "Novo"} Departamento</DialogTitle>
          <DialogDescription>
            {department ? "Atualize os detalhes do departamento" : "Crie um novo departamento para organizar seus produtos"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do departamento" {...field} />
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
                    <Textarea placeholder="Descrição do departamento" {...field} />
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
                {department ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
