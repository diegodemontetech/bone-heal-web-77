
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProductCategory } from "@/types/product";

export interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: ProductCategory | null;
  // Mudando de departmentId para department para compatibilidade
  department?: string;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().optional(),
  department_id: z.string().min(1, {
    message: "O departamento é obrigatório.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function CategoryForm({ open, onClose, onSuccess, category, department }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      department_id: category?.department_id || department || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const upsertData = {
        name: values.name,
        description: values.description,
        department_id: values.department_id,
      };

      let response;
      if (category) {
        response = await supabase
          .from("product_categories")
          .update(upsertData)
          .eq("id", category.id);
      } else {
        response = await supabase
          .from("product_categories")
          .insert([upsertData]);
      }

      if (response.error) {
        throw response.error;
      }

      toast.success(`Categoria ${category ? 'atualizada' : 'criada'} com sucesso!`);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar categoria:", error);
      toast.error(`Erro ao salvar categoria: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
          <DialogDescription>
            {category ? "Edite os campos da categoria." : "Adicione uma nova categoria."}
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
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição da categoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID do Departamento</FormLabel>
                  <FormControl>
                    <Input placeholder="ID do departamento" {...field} readOnly={!!department} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
