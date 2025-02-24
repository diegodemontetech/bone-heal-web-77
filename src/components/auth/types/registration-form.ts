
import { z } from "zod";

export const formSchema = z.object({
  pessoa_tipo: z.enum(['fisica', 'juridica'], {
    required_error: "Você precisa selecionar o tipo de pessoa.",
  }),
  fullName: z.string().min(2, {
    message: "Nome completo deve ter pelo menos 2 caracteres.",
  }),
  razao_social: z.string().optional(),
  nome_fantasia: z.string().optional(),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  address: z.string().min(5, {
    message: "Endereço deve ter pelo menos 5 caracteres.",
  }),
  address_number: z.string().min(1, {
    message: "Número do endereço é obrigatório.",
  }),
  complement: z.string().optional(),
  neighborhood: z.string().min(3, {
    message: "Bairro deve ter pelo menos 3 caracteres.",
  }),
  city: z.string().min(3, {
    message: "Cidade deve ter pelo menos 3 caracteres.",
  }),
  state: z.string().min(2, {
    message: "Estado deve ter pelo menos 2 caracteres.",
  }),
  zip_code: z.string().min(8, {
    message: "CEP deve ter pelo menos 8 caracteres.",
  }),
  phone: z.string().min(10, {
    message: "Telefone deve ter pelo menos 10 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  password: z.string().min(6, {
    message: "Senha deve ter pelo menos 6 caracteres.",
  }),
  confirmPassword: z.string(),
  specialty: z.string().min(1, {
    message: "Selecione uma especialidade.",
  }),
  cro: z.string().min(3, {
    message: "CRO deve ter pelo menos 3 caracteres.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
}).refine(
  (data) => {
    if (data.pessoa_tipo === 'fisica') {
      return !!data.cpf && data.cpf.length > 0;
    }
    return !!data.cnpj && !!data.razao_social && data.cnpj.length > 0 && data.razao_social.length > 0;
  },
  {
    message: "Os campos obrigatórios devem ser preenchidos",
    path: ['pessoa_tipo']
  }
);

export type FormData = z.infer<typeof formSchema>;
