
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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
import { CRMStage } from "@/types/crm";

const automationSchema = z.object({
  stage: z.string().min(1, "Estágio obrigatório"),
  next_stage: z.string().optional(),
  hours_trigger: z.coerce.number().int().nonnegative().optional(),
  action_type: z.string().min(1, "Tipo de ação obrigatório"),
  action_data: z.string().min(2, "Dados da ação obrigatórios"),
});

type AutomationFormValues = z.infer<typeof automationSchema>;

interface AutomationFormProps {
  onSuccess?: () => void;
}

export function AutomationForm({ onSuccess }: AutomationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [stages, setStages] = useState<CRMStage[]>([]);

  const form = useForm<AutomationFormValues>({
    resolver: zodResolver(automationSchema),
    defaultValues: {
      stage: "",
      next_stage: "",
      hours_trigger: 24,
      action_type: "email",
      action_data: "",
    },
  });

  const watchActionType = form.watch("action_type");

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const { data, error } = await supabase
          .from("crm_stages")
          .select("id, name")
          .order("name");

        if (error) throw error;
        setStages(data || []);
      } catch (error: any) {
        console.error("Erro ao buscar estágios:", error);
        toast.error("Erro ao carregar estágios");
      }
    };

    fetchStages();
  }, []);

  const onSubmit = async (data: AutomationFormValues) => {
    try {
      setIsLoading(true);
      
      // Processar dados da ação
      let actionData: any = {};
      
      if (data.action_type === "email") {
        actionData = {
          subject: "Assunto padrão",
          body: data.action_data,
        };
      } else if (data.action_type === "webhook") {
        actionData = {
          url: data.action_data,
          method: "POST",
        };
      } else if (data.action_type === "n8n") {
        actionData = {
          workflow_id: data.action_data,
        };
      }
      
      const { error } = await supabase
        .from("crm_stage_automations")
        .insert([{ 
          stage: data.stage,
          next_stage: data.next_stage || null,
          hours_trigger: data.hours_trigger || null,
          action_type: data.action_type,
          action_data: actionData,
        }]);

      if (error) throw error;
      
      toast.success("Automação criada com sucesso!");
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Erro ao criar automação:", error);
      toast.error(`Erro ao criar automação: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const actionTypes = [
    { value: "email", label: "Enviar E-mail" },
    { value: "webhook", label: "Webhook" },
    { value: "n8n", label: "Workflow N8N" },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estágio</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estágio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Estágio que ativa a automação
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="next_stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Próximo Estágio (opcional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o próximo estágio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Nenhum (não mover)</SelectItem>
                      {stages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Estágio para onde o lead será movido após a automação
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hours_trigger"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horas para Acionamento</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Quantas horas depois de entrar no estágio a automação será acionada (0 = imediato)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="action_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Ação</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de ação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {actionTypes.map((type) => (
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
            
            <FormField
              control={form.control}
              name="action_data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {watchActionType === "email" ? "Corpo do E-mail" : 
                     watchActionType === "webhook" ? "URL do Webhook" : 
                     "ID do Workflow N8N"}
                  </FormLabel>
                  <FormControl>
                    {watchActionType === "email" ? (
                      <Textarea 
                        placeholder="Conteúdo do e-mail a ser enviado" 
                        className="min-h-32"
                        {...field} 
                      />
                    ) : (
                      <Input 
                        placeholder={
                          watchActionType === "webhook" ? "https://exemplo.com/webhook" : 
                          "ID do workflow no N8N"
                        } 
                        {...field} 
                      />
                    )}
                  </FormControl>
                  <FormDescription>
                    {watchActionType === "email" ? "Você pode usar variáveis como {{nome}} e {{email}}" : 
                     watchActionType === "webhook" ? "Endpoint que receberá os dados do lead" : 
                     "Identificador do workflow que será executado no N8N"}
                  </FormDescription>
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
                  Adicionar Automação
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
