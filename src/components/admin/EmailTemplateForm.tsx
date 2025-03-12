
import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Editor } from "@tinymce/tinymce-react";
import { EmailTemplate } from '@/types/email';
import { stringifyForSupabase } from '@/utils/supabaseJsonUtils';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome do template deve ter pelo menos 2 caracteres.",
  }),
  subject: z.string().min(2, {
    message: "O assunto do email deve ter pelo menos 2 caracteres.",
  }),
  body: z.string().min(10, {
    message: "O corpo do email deve ter pelo menos 10 caracteres.",
  }),
  event_type: z.string().min(2, {
    message: "O tipo de evento deve ter pelo menos 2 caracteres.",
  }),
  trigger_event: z.string().optional(),
  variables: z.array(z.string()).optional(),
  active: z.boolean().default(true),
  auto_send: z.boolean().default(false),
});

interface EmailTemplateFormProps {
  template?: EmailTemplate;
  onSuccess?: () => void;
}

const EmailTemplateForm: React.FC<EmailTemplateFormProps> = ({ template, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [availableVariables, setAvailableVariables] = useState<string[]>([]);
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [editorContent, setEditorContent] = useState<string>(template?.body || '');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: template?.name || "",
      subject: template?.subject || "",
      body: template?.body || "",
      event_type: template?.event_type || "",
      trigger_event: template?.trigger_event || "",
      variables: template?.variables || [],
      active: template?.active !== undefined ? template.active : true,
      auto_send: template?.auto_send !== undefined ? template.auto_send : false,
    },
  });

  useEffect(() => {
    // Simulação de busca de variáveis disponíveis (substitua pela sua lógica real)
    const fetchAvailableVariables = async () => {
      // Exemplo de variáveis disponíveis
      const variables = ["customer_name", "order_id", "product_name", "appointment_date"];
      setAvailableVariables(variables);
    };

    fetchAvailableVariables();
  }, []);

  useEffect(() => {
    // Garante que o estado do editor seja atualizado quando o template é carregado
    if (template?.body) {
      setEditorContent(template.body);
      form.setValue("body", template.body);
    }
    if (template?.variables) {
      setSelectedVariables(template.variables);
    }
  }, [template, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const templateData = {
        name: values.name,
        subject: values.subject,
        body: editorContent, // Usar o conteúdo do editor TinyMCE
        event_type: values.event_type,
        trigger_event: values.trigger_event,
        variables: stringifyForSupabase(selectedVariables), // Converter para o formato correto do Supabase
        active: values.active,
        auto_send: values.auto_send
      };

      if (template) {
        // Atualizar template existente
        const { data, error } = await supabase
          .from('email_templates')
          .update(templateData)
          .eq('id', template.id);

        if (error) {
          console.error("Erro ao atualizar template:", error);
          toast.error("Erro ao atualizar template");
        } else {
          toast.success("Template atualizado com sucesso!");
          if (onSuccess) onSuccess();
        }
      } else {
        // Criar novo template
        const { data, error } = await supabase
          .from('email_templates')
          .insert([templateData]);

        if (error) {
          console.error("Erro ao criar template:", error);
          toast.error("Erro ao criar template");
        } else {
          toast.success("Template criado com sucesso!");
          if (onSuccess) onSuccess();
        }
      }
    } catch (error) {
      console.error("Erro ao salvar template:", error);
      toast.error("Erro ao salvar template");
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = useCallback((content: string) => {
    setEditorContent(content);
    form.setValue("body", content);
  }, [form]);

  const handleVariableSelect = (variable: string) => {
    if (!selectedVariables.includes(variable)) {
      setSelectedVariables([...selectedVariables, variable]);
    }
  };

  const handleVariableRemove = (variable: string) => {
    setSelectedVariables(selectedVariables.filter((v) => v !== variable));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{template ? "Editar Template de Email" : "Novo Template de Email"}</CardTitle>
        <CardDescription>
          Preencha os campos abaixo para {template ? "atualizar" : "criar"} um template de email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Template</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Boas-vindas ao cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assunto do Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Assunto do email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="emailBody">Corpo do Email</Label>
                <Editor
                  apiKey="your-api-key"
                  value={editorContent}
                  onEditorChange={handleEditorChange}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                      'bold italic backcolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                />
                <FormMessage />
              </div>
            </div>

            <FormField
              control={form.control}
              name="event_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Evento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: customer_created" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trigger_event"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evento de Disparo (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: order_paid" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Variáveis Disponíveis</FormLabel>
              <FormDescription>
                Selecione as variáveis que deseja usar neste template.
              </FormDescription>
              <div className="flex flex-wrap gap-2">
                {availableVariables.map((variable) => (
                  <Button
                    key={variable}
                    variant="outline"
                    size="sm"
                    onClick={() => handleVariableSelect(variable)}
                    disabled={selectedVariables.includes(variable)}
                  >
                    {variable}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <FormLabel>Variáveis Selecionadas</FormLabel>
              <div className="flex flex-wrap gap-2">
                {selectedVariables.map((variable) => (
                  <div key={variable} className="flex items-center space-x-2 border rounded-md p-2">
                    <Label>{variable}</Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleVariableRemove(variable)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Ativo</FormLabel>
                      <FormDescription>
                        Define se o template está ativo e pode ser usado.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="auto_send"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Envio Automático</FormLabel>
                      <FormDescription>
                        Define se o email é enviado automaticamente quando o evento é disparado.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Template"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EmailTemplateForm;
