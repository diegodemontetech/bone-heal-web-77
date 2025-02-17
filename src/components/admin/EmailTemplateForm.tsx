
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  event_type: z.string().min(2, "Tipo de evento muito curto"),
  subject: z.string().min(2, "Assunto muito curto"),
  body: z.string().min(10, "Corpo do email muito curto"),
  variables: z.string().optional(),
});

interface EmailTemplateFormProps {
  template?: any;
  onSuccess: () => void;
}

export const EmailTemplateForm = ({ template, onSuccess }: EmailTemplateFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: template ? {
      name: template.name,
      event_type: template.event_type,
      subject: template.subject,
      body: template.body,
      variables: template.variables ? JSON.stringify(template.variables) : "[]",
    } : {
      variables: "[]",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const templateData = {
        ...values,
        variables: JSON.parse(values.variables || "[]"),
      };

      if (template?.id) {
        const { error } = await supabase
          .from("email_templates")
          .update(templateData)
          .eq("id", template.id);

        if (error) throw error;
        toast.success("Template atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from("email_templates")
          .insert([templateData]);

        if (error) throw error;
        toast.success("Template criado com sucesso!");
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Template</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="event_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Evento</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Assunto</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Corpo do Email (HTML)</FormLabel>
              <FormControl>
                <Textarea {...field} rows={10} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="variables"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variáveis (JSON Array)</FormLabel>
              <FormControl>
                <Input {...field} placeholder='["nome", "email"]' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {template ? "Atualizar" : "Criar"} Template
        </Button>
      </form>
    </Form>
  );
};
