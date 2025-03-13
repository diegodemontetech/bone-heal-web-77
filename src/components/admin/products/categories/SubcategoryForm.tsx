import { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProductSubcategory, ProductCategory } from "@/types/product";
import { parseJsonObject } from "@/utils/supabaseJsonUtils";
import { Json } from "@/integrations/supabase/types";

// Apenas definindo a interface correta da props para evitar erros de tipo
export interface SubcategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: ProductCategory;
  subcategory?: ProductSubcategory | null;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().optional(),
  default_fields: z.record(z.string(), z.any()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function SubcategoryForm({ open, onClose, onSuccess, category, subcategory }: SubcategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    if (subcategory) {
      setFields(subcategory.default_fields || {});
    } else {
      setFields({});
    }
  }, [subcategory]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subcategory?.name || "",
      description: subcategory?.description || "",
      default_fields: subcategory?.default_fields || {},
    },
  });

  const handleAddField = (fieldName: string, value: any) => {
    setFields(prev => ({ ...prev, [fieldName]: value }));
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const upsertData = {
        ...values,
        category_id: category.id,
        default_fields: fields as Json,
      };

      let response;
      if (subcategory) {
        response = await supabase
          .from("product_subcategories")
          .update(upsertData)
          .eq("id", subcategory.id);
      } else {
        response = await supabase
          .from("product_subcategories")
          .insert([upsertData]);
      }

      if (response.error) {
        throw response.error;
      }

      toast.success(`Subcategoria ${subcategory ? 'atualizada' : 'criada'} com sucesso!`);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar subcategoria:", error);
      toast.error(`Erro ao salvar subcategoria: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{subcategory ? "Editar Subcategoria" : "Nova Subcategoria"}</DialogTitle>
          <DialogDescription>
            {subcategory ? "Edite os campos da subcategoria." : "Adicione uma nova subcategoria."}
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
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição da subcategoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <p className="text-sm font-medium text-gray-700">Campos Personalizados</p>
              <FormDescription>Adicione campos personalizados para esta subcategoria.</FormDescription>
              {Object.entries(fields).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2 mt-2">
                  <FormLabel className="w-1/4">{key}</FormLabel>
                  <Input
                    className="w-3/4"
                    value={value}
                    onChange={(e) => handleAddField(key, e.target.value)}
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => {
                const newFieldName = prompt("Nome do novo campo:");
                if (newFieldName) {
                  handleAddField(newFieldName, "");
                }
              }}>
                Adicionar Campo
              </Button>
            </div>

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
