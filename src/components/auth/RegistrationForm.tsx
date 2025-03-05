import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[\s(-]?[0-9]{3}))?([-]?[\s]?[0-9]{3})?([-]?[\s]?[0-9]{2,4})+$/
);

const DentistSignUpSchema = z.object({
  fullName: z.string().min(2, {
    message: "Nome completo deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(6, {
    message: "Senha deve ter pelo menos 6 caracteres.",
  }),
  cro: z.string().min(5, {
    message: "CRO deve ter pelo menos 5 caracteres.",
  }),
  specialty: z.string().min(2, {
    message: "Especialidade deve ter pelo menos 2 caracteres.",
  }),
  address: z.string().min(5, {
    message: "Endereço deve ter pelo menos 5 caracteres.",
  }),
  endereco_numero: z.string().optional(),
  complemento: z.string().optional(),
  city: z.string().min(3, {
    message: "Cidade deve ter pelo menos 3 caracteres.",
  }),
  state: z.string().min(2, {
    message: "Estado deve ter pelo menos 2 caracteres.",
  }),
  neighborhood: z.string().min(3, {
    message: "Bairro deve ter pelo menos 3 caracteres.",
  }),
  zipCode: z.string().length(8, {
    message: "CEP deve ter 8 caracteres.",
  }),
  phone: z.string().regex(phoneRegex, {
    message: "Número de telefone inválido.",
  }),
  cnpj: z.string().optional(),
  cpf: z.string().optional(),
  receiveNews: z.boolean().default(false),
})

type DentistSignUpData = z.infer<typeof DentistSignUpSchema>;

interface RegistrationFormProps {
  isDentist?: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ isDentist }) => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<DentistSignUpData>({
    resolver: zodResolver(DentistSignUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      cro: "",
      specialty: "",
      address: "",
      city: "",
      state: "",
      neighborhood: "",
      zipCode: "",
      phone: "",
      cnpj: "",
      cpf: "",
      receiveNews: false,
    },
  });

  const onSubmit = async (data: DentistSignUpData) => {
    try {
      setSubmitting(true);
      
      await signUp(data.email, data.password, {
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
        cpf: data.cpf,
        complemento: data.complemento,
        endereco_numero: data.endereco_numero,
        receive_news: data.receiveNews
      });
      
      // Redirecionar para a página de verificação ou login
      navigate('/login');
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            role: 'dentist' // Novo usuário sempre começa como dentista
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu e-mail para confirmar o cadastro.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="seu-email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Sua senha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CRO</FormLabel>
                <FormControl>
                  <Input placeholder="Número do seu CRO" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidade</FormLabel>
                <FormControl>
                  <Input placeholder="Sua especialidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(XX) XXXX-XXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input placeholder="Rua, Avenida..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endereco_numero"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input placeholder="Número" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="complemento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input placeholder="Complemento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input placeholder="Seu bairro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Sua cidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AC">Acre</SelectItem>
                      <SelectItem value="AL">Alagoas</SelectItem>
                      <SelectItem value="AP">Amapá</SelectItem>
                      <SelectItem value="AM">Amazonas</SelectItem>
                      <SelectItem value="BA">Bahia</SelectItem>
                      <SelectItem value="CE">Ceará</SelectItem>
                      <SelectItem value="DF">Distrito Federal</SelectItem>
                      <SelectItem value="ES">Espírito Santo</SelectItem>
                      <SelectItem value="GO">Goiás</SelectItem>
                      <SelectItem value="MA">Maranhão</SelectItem>
                      <SelectItem value="MT">Mato Grosso</SelectItem>
                      <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      <SelectItem value="PA">Pará</SelectItem>
                      <SelectItem value="PB">Paraíba</SelectItem>
                      <SelectItem value="PR">Paraná</SelectItem>
                      <SelectItem value="PE">Pernambuco</SelectItem>
                      <SelectItem value="PI">Piauí</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                      <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                      <SelectItem value="RO">Rondônia</SelectItem>
                      <SelectItem value="RR">Roraima</SelectItem>
                      <SelectItem value="SC">Santa Catarina</SelectItem>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="SE">Sergipe</SelectItem>
                      <SelectItem value="TO">Tocantins</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input placeholder="XXXXX-XXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Seu CNPJ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Seu CPF" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="receiveNews"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-sm">
                  Desejo receber novidades e promoções
                </FormLabel>
                <FormDescription>
                  Fique por dentro das novidades e promoções da Bone Heal.
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={submitting} className="w-full">
          Cadastrar
        </Button>
      </form>
    </Form>
  );
};

export default RegistrationForm;
