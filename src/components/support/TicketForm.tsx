import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from '@/hooks/use-auth-context';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  message: z.string().min(2, {
    message: "Mensagem deve ter pelo menos 2 caracteres.",
  }),
});

interface TicketProps {
  ticket: {
    assigned_to: string;
    created_at: string;
    customer_id: string;
    description: string;
    id: string;
    priority: string;
    status: string;
    subject: string;
    updated_at: string;
  };
  onMessageSent?: () => void;
}

export function TicketForm({ ticket, onMessageSent }: TicketProps) {
  const { toast } = useToast()
  const { profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (!profile) {
        toast({
          title: "Erro!",
          description: "Usuário não autenticado.",
          variant: "destructive",
        })
        return;
      }

      const user_id = profile.id;

      // Usar:
      await supabase.from('ticket_messages').insert({
        sender_id: user_id, // alterado de user_id para sender_id
        ticket_id: ticket.id, // assegurando que estamos acessando o ID do ticket
        message: values.message,
        is_from_customer: true // adicionado este campo
      });

      form.reset();
      toast({
        title: "Sucesso!",
        description: "Mensagem enviada com sucesso.",
      })
      onMessageSent?.();
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Houve um erro ao enviar a mensagem.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensagem</FormLabel>
              <FormControl>
                <Textarea placeholder="Escreva sua mensagem aqui." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          Enviar Mensagem
        </Button>
        <p>Ticket: #{ticket.id.substring(0, 8)}</p>
      </form>
    </Form>
  )
}
