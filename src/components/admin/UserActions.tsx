
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { UserWithProfile } from "@/types/user";
import { useModal } from "@/hooks/use-modal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserActionsProps {
  user: UserWithProfile;
  onDelete: () => void;
}

export const UserActions = ({ user, onDelete }: UserActionsProps) => {
  const { onOpen } = useModal();

  const handleDelete = async () => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id);

      if (error) {
        console.error("Erro ao excluir usuário:", error);
        toast.error("Erro ao excluir usuário: " + error.message);
      } else {
        toast.success("Usuário excluído com sucesso!");
        onDelete();
      }
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Erro ao excluir usuário: " + (error as Error).message);
    }
  };

  return (
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
              userId: user.id,
              user: user,
            })
          }
        >
          <Pencil className="mr-2 h-4 w-4" /> Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-500 focus:text-red-500"
        >
          <Trash className="mr-2 h-4 w-4" /> Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
