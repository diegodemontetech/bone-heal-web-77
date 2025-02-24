
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DesktopNav } from "./navbar/DesktopNav";
import { MobileNav } from "./navbar/MobileNav";
import { UserMenu } from "./navbar/UserMenu";

export default function Navbar() {
  const session = useSession();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-background border-b">
      <div className="container flex items-center justify-between py-2">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/lovable-uploads/c5a855af-42eb-4ffd-8fa0-bacd9ce220b3.png"
            alt="BoneHeal"
            className="h-10"
          />
        </Link>

        <DesktopNav />
        <UserMenu handleSignOut={handleSignOut} />
        <MobileNav open={open} setOpen={setOpen} handleSignOut={handleSignOut} />
      </div>
    </div>
  );
}
