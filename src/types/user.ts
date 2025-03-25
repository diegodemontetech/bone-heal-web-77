
export interface UserWithProfile {
  id: string;
  email: string | null;
  created_at: string;
  profile: {
    full_name: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    is_admin: boolean | null;
    contact_type: string | null;
    omie_code?: string | null;
    omie_sync?: boolean | null;
    pessoa_tipo?: string | null;
    razao_social?: string | null;
    nome_fantasia?: string | null;
    responsavel_tecnico?: string | null;
    cpf_responsavel?: string | null;
    cro_responsavel?: string | null;
    epao?: string | null;
    is_pessoa_fisica?: boolean | null;
  } | null;
}

export interface DatabaseProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  is_admin: boolean | null;
  contact_type: string | null;
  created_at: string;
  omie_code?: string | null;
  omie_sync?: boolean | null;
  pessoa_tipo?: string | null;
  razao_social?: string | null;
  nome_fantasia?: string | null;
  responsavel_tecnico?: string | null;
  cpf_responsavel?: string | null;
  cro_responsavel?: string | null;
  epao?: string | null;
  is_pessoa_fisica?: boolean | null;
  auth_users: { email: string }[] | null;
}
