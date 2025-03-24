
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Customer {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  omie_code?: string;
  omie_sync?: boolean;
}

// ID do cliente de teste que queremos excluir
const TEST_CLIENT_ID = "e59a4eb5-3dd5-4f8f-96e5-75f16564bcf3";

export const useCustomerState = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCustomers = async () => {
    try {
      console.log("[useCustomerState] Iniciando busca de clientes com termo:", searchTerm);
      setIsLoadingCustomers(true);
      
      // Buscar perfis que são dentistas (clientes)
      let query = supabase
        .from('profiles')
        .select('id, full_name, email, phone, address, city, state, zip_code, omie_code, omie_sync')
        .neq('id', TEST_CLIENT_ID)
        .or('role.eq.dentist,is_admin.eq.false'); // Buscar dentistas OU perfis que não são admin
      
      if (searchTerm && searchTerm.trim() !== "") {
        // Verificar se a busca parece ser um código numérico
        const isNumericSearch = /^\d+$/.test(searchTerm.trim());
        
        if (isNumericSearch) {
          query = query.or(
            `full_name.ilike.%${searchTerm}%,omie_code.eq.${searchTerm}`
          );
        } else {
          query = query.or(
            `full_name.ilike.%${searchTerm}%,` +
            `email.ilike.%${searchTerm}%,` +
            `phone.ilike.%${searchTerm}%`
          );
        }
      }

      // Adicionar ordenação para manter consistente
      query = query.order('full_name', { ascending: true });
      
      const { data: profilesData, error: profilesError } = await query;

      if (profilesError) {
        console.error('[useCustomerState] Erro na consulta de perfis:', profilesError);
        throw profilesError;
      }

      console.log(`[useCustomerState] Encontrados ${profilesData?.length || 0} perfis na consulta`);

      // Formatar os dados de cliente diretamente dos perfis
      const formattedCustomers = (profilesData || []).map(profile => ({
        id: profile.id,
        full_name: profile.full_name || 'Sem nome',
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        zip_code: profile.zip_code,
        omie_code: profile.omie_code,
        omie_sync: profile.omie_sync
      }));

      console.log(`[useCustomerState] Encontrados ${formattedCustomers.length} clientes na busca`);
      setCustomers(formattedCustomers);
    } catch (error) {
      console.error('[useCustomerState] Erro ao buscar clientes:', error);
      toast.error('Erro ao carregar lista de clientes');
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm]); // A busca é refeita quando o searchTerm muda

  const refreshCustomers = () => {
    fetchCustomers();
  };

  return {
    customers,
    selectedCustomer,
    setSelectedCustomer,
    isLoadingCustomers,
    searchTerm,
    setSearchTerm,
    refreshCustomers
  };
};
