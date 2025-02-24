
import { Link } from "react-router-dom";
import { Book, Mail, Info, Newspaper, Menu, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";

interface MobileNavProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleSignOut: () => void;
}

export function MobileNav({ open, setOpen, handleSignOut }: MobileNavProps) {
  const session = useSession();

  const navItems = [
    { to: "/products", icon: Book, label: "Produtos" },
    { to: "/contact", icon: Mail, label: "Contato" },
    { to: "/about", icon: Info, label: "História" },
    { to: "/news", icon: Newspaper, label: "Notícias" },
    { to: "/studies", icon: Book, label: "Artigos Científicos" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="md:hidden">
          <Button variant="outline" size="icon">
            <Menu />
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Navegue pelo site da BoneHeal</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            </Link>
          ))}
          {session ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <User className="w-4 h-4" />
                  Meu Perfil
                </Button>
              </Link>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  handleSignOut();
                  setOpen(false);
                }}
              >
                Sair
              </Button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button className="w-full">Entrar</Button>
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
