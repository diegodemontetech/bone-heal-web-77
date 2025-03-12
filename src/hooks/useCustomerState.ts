
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
}

export const useCustomerState = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        console.log("Iniciando busca de clientes no Supabase...");
        
        let query = supabase
          .from('profiles')
          .select('id, full_name, email, phone, address, city, state, zip_code')
          .order('full_name');

        if (searchTerm) {
          query = query.or(
            `full_name.ilike.%${searchTerm}%,` +
            `email.ilike.%${searchTerm}%,` +
            `phone.ilike.%${searchTerm}%`
          );
        }

        const { data, error } = await query;

        if (error) {
          console.error('Erro na consulta do Supabase:', error);
          throw error;
        }

        const formattedCustomers = data.map(customer => ({
          id: customer.id,
          full_name: customer.full_name || 'Sem nome',
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          zip_code: customer.zip_code
        }));

        console.log(`Clientes encontrados no Supabase:`, formattedCustomers);
        setCustomers(formattedCustomers);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        toast.error('Erro ao carregar lista de clientes');
      } finally {
        setIsLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, [searchTerm]); // Agora a busca é refeita quando o searchTerm muda

  return {
    customers,
    selectedCustomer,
    setSelectedCustomer,
    isLoadingCustomers,
    searchTerm,
    setSearchTerm
  };
};
