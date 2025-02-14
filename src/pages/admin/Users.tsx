
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import TestOmieSync from "@/components/TestOmieSync";
import { UsersFilter } from "@/components/admin/UsersFilter";
import { UsersTable } from "@/components/admin/UsersTable";
import { UserWithProfile, DatabaseProfile } from "@/types/user";

const Users = () => {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [contactTypeFilter, setContactTypeFilter] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("profiles")
        .select(`
          *,
          auth_users:id(email)
        `)
        .order("created_at", { ascending: false });

      if (contactTypeFilter) {
        query = query.eq("contact_type", contactTypeFilter);
      }

      console.log('Executando query de usuários...');
      const { data, error } = await query;
      console.log('Resultado da query:', data);

      if (error) {
        console.error("Erro ao buscar usuários:", error);
        toast.error("Erro ao buscar usuários: " + error.message);
      } else if (data) {
        // Mapeia os dados considerando o retorno correto da query
        const usersWithProfile: UserWithProfile[] = (data as unknown as DatabaseProfile[]).map((profile) => ({
          id: profile.id,
          email: profile.auth_users?.[0]?.email || null,
          created_at: profile.created_at,
          profile: {
            full_name: profile.full_name,
            phone: profile.phone,
            address: profile.address,
            city: profile.city,
            state: profile.state,
            zip_code: profile.zip_code,
            is_admin: profile.is_admin,
            contact_type: profile.contact_type,
          },
        }));
        
        console.log('Usuários processados:', usersWithProfile);
        setUsers(usersWithProfile);
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro inesperado ao buscar usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [contactTypeFilter]);

  const filteredUsers = users.filter((user) => {
    const fullName = user.profile?.full_name || "";
    return fullName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Usuários</h1>
      <TestOmieSync />
      <UsersFilter
        search={search}
        onSearchChange={setSearch}
        contactTypeFilter={contactTypeFilter}
        onContactTypeFilterChange={setContactTypeFilter}
      />
      <div className="mt-4">
        {loading ? (
          <p>Carregando usuários...</p>
        ) : users.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          <UsersTable users={filteredUsers} onRefetch={fetchUsers} />
        )}
      </div>
    </div>
  );
};

export default Users;
