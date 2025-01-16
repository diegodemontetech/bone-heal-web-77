import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RegistrationFormFields } from "./RegistrationFormFields";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string(),
  fullName: z.string().min(2, "Nome muito curto"),
  cnpj: z.string().optional(),
  cro: z.string().min(4, "CRO inválido"),
  address: z.string().min(5, "Endereço muito curto"),
  city: z.string().min(2, "Cidade muito curta"),
  state: z.string().length(2, "UF deve ter 2 letras"),
  neighborhood: z.string().min(2, "Bairro muito curto"),
  phone: z.string().min(10, "Telefone inválido"),
  zipCode: z.string().min(8, "CEP inválido"),
  specialty: z.string(),
  receiveNews: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { data: specialties } = useQuery({
    queryKey: ["dental-specialties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dental_specialties")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiveNews: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      
      const { error: signUpError, data: { user } } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (!user?.id) throw new Error("Erro ao criar usuário");

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          full_name: values.fullName,
          cnpj: values.cnpj || null,
          cro: values.cro,
          address: values.address,
          city: values.city,
          state: values.state,
          neighborhood: values.neighborhood,
          phone: values.phone,
          zip_code: values.zipCode,
          specialty: values.specialty,
          receive_news: values.receiveNews,
        });

      if (profileError) throw profileError;

      // Create customer in OMIE
      const { error: omieError } = await supabase.functions.invoke('omie-customer', {
        body: { profile_id: user.id }
      });

      if (omieError) {
        console.error('Error creating customer in OMIE:', omieError);
        // Don't throw the error, just log it - we don't want to block registration if OMIE integration fails
      }

      toast.success("Cadastro realizado com sucesso!");
      navigate("/products");
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar cadastro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <RegistrationFormFields form={form} specialties={specialties || []} />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>
    </Form>
  );
};

export default RegistrationForm;