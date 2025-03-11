
import { useState } from "react";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const flowFormSchema = z.object({
  name: z.string().min(3, "Nome precisa ter pelo menos 3 caracteres"),
  description: z.string().optional(),
});

type FlowFormValues = z.infer<typeof flowFormSchema>;

interface FlowCreateFormProps {
  onCreateFlow: (name: string, description: string) => Promise<any>;
  onComplete: () => void;
}

const FlowCreateForm = ({ onCreateFlow, onComplete }: FlowCreateFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FlowFormValues>({
    resolver: zodResolver(flowFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleCreate = async (values: FlowFormValues) => {
    try {
      setIsSubmitting(true);
      const result = await onCreateFlow(values.name, values.description || "");
      
      if (result) {
        form.reset();
        toast.success("Fluxo criado com sucesso!");
        onComplete();
      }
    } catch (error) {
      console.error("Erro ao criar fluxo:", error);
      toast.error("Erro ao criar fluxo. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Fluxo</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Automação de Leads" 
                />
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
                <Textarea
                  {...field}
                  placeholder="Detalhe o propósito deste fluxo..."
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancelar</Button>
          </DialogClose>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Criando..." : "Criar Fluxo"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FlowCreateForm;
