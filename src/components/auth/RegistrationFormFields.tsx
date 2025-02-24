
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PersonalSection } from "./form-sections/PersonalSection";
import { AddressSection } from "./form-sections/AddressSection";
import { ContactSection } from "./form-sections/ContactSection";
import { AccountSection } from "./form-sections/AccountSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  fullName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  phone: z.string().min(10, "Telefone inválido"),
  cro: z.string().min(4, "CRO inválido"),
  specialty: z.string(),
  address: z.string().min(3, "Endereço inválido"),
  city: z.string().min(3, "Cidade inválida"),
  state: z.string().length(2, "Estado inválido"),
  neighborhood: z.string().min(3, "Bairro inválido"),
  zipCode: z.string().length(8, "CEP inválido"),
  cnpj: z.string().optional(),
  receiveNews: z.boolean().default(false),
  omie_city_code: z.string(),
  razao_social: z.string().optional(),
  nome_fantasia: z.string().optional(),
  telefone1_ddd: z.string().length(2, "DDD inválido"),
  telefone1_numero: z.string().min(8, "Número de telefone inválido"),
  endereco_numero: z.string().min(1, "Número do endereço é obrigatório"),
});

const RegistrationFormFields = () => {
  const { data: specialties } = useQuery({
    queryKey: ['specialties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const { data: cities } = useQuery({
    queryKey: ['omie-cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('omie_cities')
        .select('*');

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiveNews: false,
      razao_social: "",
      nome_fantasia: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Prepare metadata for signup
      const metadata = {
        full_name: data.fullName,
        cro: data.cro,
        specialty: data.specialty,
        address: data.address,
        city: data.city,
        state: data.state,
        neighborhood: data.neighborhood,
        zip_code: data.zipCode,
        phone: data.phone,
        cnpj: data.cnpj,
        receive_news: data.receiveNews,
        razao_social: data.razao_social || data.fullName,
        nome_fantasia: data.nome_fantasia || data.fullName,
        telefone1_ddd: data.telefone1_ddd,
        telefone1_numero: data.telefone1_numero,
        endereco_numero: data.endereco_numero,
        omie_city_code: data.omie_city_code,
      };

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      // Redirect ou mensagem de sucesso aqui
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PersonalSection form={form} specialties={specialties || []} />
        <AddressSection form={form} cities={cities || []} />
        <ContactSection form={form} />
        <AccountSection form={form} />
        <Button type="submit">Registrar</Button>
      </form>
    </Form>
  );
};

export default RegistrationFormFields;
