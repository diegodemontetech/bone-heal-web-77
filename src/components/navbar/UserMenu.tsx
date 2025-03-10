
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth-context";

interface UserMenuProps {
  session: any;
  mobile?: boolean;
}

export const UserMenu = ({ session, mobile }: UserMenuProps) => {
  const navigate = useNavigate();
  const { isAdmin, profile, signOut } = useAuth();

  const isAuthenticated = !!session?.user?.id || !!profile?.id;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error: any) {
      toast.error("Erro ao sair: " + error.message);
    }
  };

  const handleAreaClick = () => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/profile");
      }
    } else {
      navigate("/login", { state: { from: window.location.pathname } });
    }
  };

  if (mobile) {
    if (!isAuthenticated) {
      return (
        <div className="mb-2">
          <Button variant="default" className="w-full justify-center" onClick={() => navigate("/login")}>
            Entrar
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage 
              src={session?.user?.user_metadata?.avatar_url || (profile?.avatar_url || "")} 
              alt="Avatar do usuário"
            />
            <AvatarFallback className="bg-primary/5 text-primary">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <p className="text-sm font-medium">{profile?.full_name || "Usuário"}</p>
            <p className="text-xs text-gray-500">{profile?.specialty || "Dentista"}</p>
          </div>
        </div>
        
        <div className="border-t pt-3 space-y-1.5">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm h-auto py-2"
            onClick={() => navigate(isAdmin ? "/admin/dashboard" : "/profile")}
          >
            {isAdmin ? "Painel Admin" : "Meu Perfil"}
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm h-auto py-2"
            onClick={() => navigate("/orders")}
          >
            Meus Pedidos
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm h-auto py-2 text-red-600"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="hidden md:flex gap-2">
        <Button variant="outline" onClick={handleAreaClick}>
          Área do Dentista
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9 border-2 border-primary/10">
            <AvatarImage 
              src={session?.user?.user_metadata?.avatar_url || (profile?.avatar_url || "")} 
              alt="Avatar do usuário"
            />
            <AvatarFallback className="bg-primary/5">
              <User className="h-4 w-4 text-primary" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">{profile?.full_name || "Usuário"}</p>
            <p className="text-xs text-gray-500">{profile?.specialty || "Dentista"}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(isAdmin ? "/admin/dashboard" : "/profile")}>
          {isAdmin ? "Painel Admin" : "Meu Perfil"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/orders")}>
          Meus Pedidos
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
