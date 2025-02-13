
import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useModal } from "@/hooks/use-modal";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import TestOmieSync from "@/components/TestOmieSync";

interface UserWithProfile {
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
  } | null;
}

interface DatabaseProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  is_admin: boolean | null;
  created_at: string;
  auth_users: { email: string }[] | null;
}

const Users = () => {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { onOpen } = useModal();
  const [search, setSearch] = useState("");
  const [isAdminFilter, setIsAdminFilter] = useState<boolean | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [isAdminFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("profiles")
        .select("*, auth_users:auth.users(email)")
        .order("created_at", { ascending: false });

      if (isAdminFilter !== null) {
        query = query.eq("is_admin", isAdminFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar usuários:", error);
        toast.error("Erro ao buscar usuários: " + error.message);
      } else if (data) {
        const usersWithProfile: UserWithProfile[] = (data as DatabaseProfile[]).map((profile) => ({
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
          },
        }));
        setUsers(usersWithProfile);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        console.error("Erro ao excluir usuário:", error);
        toast.error("Erro ao excluir usuário: " + error.message);
      } else {
        toast.success("Usuário excluído com sucesso!");
        fetchUsers();
      }
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Erro ao excluir usuário: " + (error as Error).message);
    }
  };

  const columns: ColumnDef<UserWithProfile>[] = [
    {
      accessorKey: "profile.full_name",
      header: "Nome",
      cell: ({ row }) => {
        const fullName = row.getValue("profile.full_name") as string | null;
        return (
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${fullName}`}
              />
              <AvatarFallback>
                {fullName ? fullName.substring(0, 2).toUpperCase() : "UN"}
              </AvatarFallback>
            </Avatar>
            <span>{fullName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "profile.phone",
      header: "Telefone",
    },
    {
      accessorKey: "profile.city",
      header: "Cidade",
    },
    {
      accessorKey: "profile.state",
      header: "Estado",
    },
    {
      accessorKey: "created_at",
      header: "Criado em",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return date.toLocaleDateString();
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                onOpen("editUser", {
                  userId: row.original.id,
                  user: row.original,
                })
              }
            >
              <Pencil className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(row.original.id)}
              className="text-red-500 focus:text-red-500"
            >
              <Trash className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: users.filter((user) => {
      const fullName = user.profile?.full_name || "";
      return fullName.toLowerCase().includes(search.toLowerCase());
    }),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Usuários</h1>
      <TestOmieSync />
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="search">Pesquisar:</Label>
          <Input
            id="search"
            type="search"
            placeholder="Pesquisar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="isAdminFilter">Filtrar por Admin:</Label>
          <Switch
            id="isAdminFilter"
            checked={isAdminFilter === true}
            onCheckedChange={(checked) => {
              if (checked) {
                setIsAdminFilter(true);
              } else if (isAdminFilter === true) {
                setIsAdminFilter(null);
              } else {
                setIsAdminFilter(false);
              }
            }}
          />
        </div>
        <Button onClick={() => onOpen("createUser")}>Criar Usuário</Button>
      </div>
      <div className="mt-4">
        {loading ? (
          <p>Carregando usuários...</p>
        ) : users.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Users;
