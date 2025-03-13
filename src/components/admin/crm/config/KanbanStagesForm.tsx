
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Department } from "@/types/crm";

const stageSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  color: z.string().min(4, "Selecione uma cor"),
  department_id: z.string().uuid("Selecione um departamento"),
  order: z.coerce.number().int().positive(),
});

type StageFormValues = z.infer<typeof stageSchema>;

interface KanbanStagesFormProps {
  onSuccess?: () => void;
}

export function KanbanStagesForm({ onSuccess }: KanbanStagesFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  const form = useForm<StageFormValues>({
    resolver: zodResolver(stageSchema),
    defaultValues: {
      name: "",
      color: "#3b82f6",
      order: 1,
    },
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data, error } = await supabase
          .from("crm_departments")
          .select("id, name")
          .order("name");

        if (error) throw error;
        setDepartments(data || []);
      } catch (error: any) {
        console.error("Erro ao buscar departamentos:", error);
        toast.error("Erro ao carregar departamentos");
      }
    };

    fetchDepartments();
  }, []);

  const onSubmit = async (data: StageFormValues) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("crm_stages")
        .insert([{ 
          name: data.name,
          color: data.color,
          department_id: data.department_id,
          order: data.order,
          pipeline_id: "" // Valor padrão vazio para satisfazer o tipo
        }]);

      if (error) throw error;
      
      toast.success("Estágio criado com sucesso!");
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Erro ao criar estágio:", error);
      toast.error(`Erro ao criar estágio: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const colorOptions = [
    { value: "#3b82f6", label: "Azul" },
    { value: "#10b981", label: "Verde" },
    { value: "#f59e0b", label: "Amarelo" },
    { value: "#ef4444", label: "Vermelho" },
    { value: "#8b5cf6", label: "Roxo" },
    { value: "#ec4899", label: "Rosa" },
    { value: "#6b7280", label: "Cinza" },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="department_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um departamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
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
                  <FormLabel>Nome do Estágio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Novo, Em Progresso, Fechado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma cor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center">
                            <div 
                              className="w-4 h-4 rounded-full mr-2" 
                              style={{ backgroundColor: color.value }}
                            />
                            {color.label}
                          </div>
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
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Estágio
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
