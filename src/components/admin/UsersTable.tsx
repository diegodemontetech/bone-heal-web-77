
import { UserWithProfile } from "@/types/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { UserAvatar } from "./UserAvatar";
import { UserActions } from "./UserActions";

interface UsersTableProps {
  users: UserWithProfile[];
  onRefetch: () => void;
}

export const UsersTable = ({ users, onRefetch }: UsersTableProps) => {
  const columns: ColumnDef<UserWithProfile>[] = [
    {
      accessorKey: "profile.full_name",
      header: "Nome",
      cell: ({ row }) => {
        const fullName = row.getValue("profile.full_name") as string | null;
        return <UserAvatar fullName={fullName} />;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "profile.contact_type",
      header: "Tipo",
      cell: ({ row }) => {
        const type = row.getValue("profile.contact_type") as string;
        return type === 'customer' ? 'Cliente' : type === 'supplier' ? 'Fornecedor' : 'Cliente/Fornecedor';
      },
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
        <UserActions user={row.original} onDelete={onRefetch} />
      ),
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
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
  );
};
