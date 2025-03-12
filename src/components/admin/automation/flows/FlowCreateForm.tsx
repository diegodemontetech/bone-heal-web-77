
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (name: string, description: string) => Promise<any>;
}

const FlowCreateForm = ({ 
  onCreateFlow, 
  onComplete, 
  isOpen = false, 
  onClose,
  onSubmit 
}: FlowCreateFormProps) => {
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
      
      // Use onSubmit se fornecido, caso contrário use onCreateFlow
      const handler = onSubmit || onCreateFlow;
      const result = await handler(values.name, values.description || "");
      
      if (result) {
        form.reset();
        toast.success("Fluxo criado com sucesso!");
        onComplete();
        if (onClose) onClose();
      }
    } catch (error) {
      console.error("Erro ao criar fluxo:", error);
      toast.error("Erro ao criar fluxo. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Se estiver usando dentro de um Dialog
  if (isOpen !== undefined) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Fluxo de Automação</DialogTitle>
          </DialogHeader>
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
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Criando..." : "Criar Fluxo"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  // Versão sem dialog (compatibilidade com o código anterior)
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
