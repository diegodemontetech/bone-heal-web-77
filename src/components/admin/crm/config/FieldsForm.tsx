
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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

const fieldSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  label: z.string().min(2, "Rótulo deve ter pelo menos 2 caracteres"),
  type: z.string(),
  required: z.boolean().default(false),
  display_in_kanban: z.boolean().default(false),
  options: z.string().optional(),
  mask: z.string().optional(),
  default_value: z.string().optional(),
});

type FieldFormValues = z.infer<typeof fieldSchema>;

interface FieldsFormProps {
  onSuccess?: () => void;
}

export function FieldsForm({ onSuccess }: FieldsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fieldType, setFieldType] = useState("text");

  const form = useForm<FieldFormValues>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      name: "",
      label: "",
      type: "text",
      required: false,
      display_in_kanban: false,
      options: "",
      mask: "",
      default_value: "",
    },
  });

  const watchType = form.watch("type");

  const onSubmit = async (data: FieldFormValues) => {
    try {
      setIsLoading(true);
      
      // Processar opções para select, radio, checkbox
      let processedOptions = null;
      if (["select", "radio", "checkbox"].includes(data.type) && data.options) {
        processedOptions = data.options.split(",").map(option => option.trim());
      }
      
      const { error } = await supabase
        .from("crm_fields")
        .insert([{ 
          name: data.name,
          label: data.label,
          type: data.type,
          required: data.required,
          display_in_kanban: data.display_in_kanban,
          options: processedOptions,
          mask: data.mask || null,
          default_value: data.default_value || null
        }]);

      if (error) throw error;
      
      toast.success("Campo criado com sucesso!");
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Erro ao criar campo:", error);
      toast.error(`Erro ao criar campo: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fieldTypes = [
    { value: "text", label: "Texto" },
    { value: "number", label: "Número" },
    { value: "email", label: "E-mail" },
    { value: "phone", label: "Telefone" },
    { value: "date", label: "Data" },
    { value: "time", label: "Hora" },
    { value: "datetime", label: "Data e Hora" },
    { value: "select", label: "Seleção" },
    { value: "radio", label: "Radio" },
    { value: "checkbox", label: "Checkbox" },
    { value: "textarea", label: "Área de Texto" },
    { value: "money", label: "Valor Monetário" },
    { value: "cpf", label: "CPF" },
    { value: "cnpj", label: "CNPJ" },
    { value: "cep", label: "CEP" }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome (ID do campo)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: email_cliente" {...field} />
                    </FormControl>
                    <FormDescription>
                      Usado internamente no sistema (sem espaços)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rótulo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: E-mail do Cliente" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nome exibido no formulário
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Campo</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setFieldType(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de campo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fieldTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {["select", "radio", "checkbox"].includes(watchType) && (
              <FormField
                control={form.control}
                name="options"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opções</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Opção 1, Opção 2, Opção 3" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Separe as opções por vírgula
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {["phone", "cpf", "cnpj", "cep", "money"].includes(watchType) && (
              <FormField
                control={form.control}
                name="mask"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Máscara</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Máscara para formatação" 
                        {...field} 
                        value={field.value || (
                          watchType === "phone" ? "(99) 99999-9999" :
                          watchType === "cpf" ? "999.999.999-99" :
                          watchType === "cnpj" ? "99.999.999/9999-99" :
                          watchType === "cep" ? "99999-999" :
                          watchType === "money" ? "R$ #.##0,00" : ""
                        )}
                      />
                    </FormControl>
                    <FormDescription>
                      Formato para exibição do campo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="default_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Padrão (opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Valor inicial do campo" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Campo obrigatório</FormLabel>
                      <FormDescription>
                        O preenchimento deste campo será exigido
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="display_in_kanban"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Exibir no Kanban</FormLabel>
                      <FormDescription>
                        Este campo será exibido nos cartões do Kanban
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Campo
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
