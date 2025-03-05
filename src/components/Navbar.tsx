
import { useSession } from "@supabase/auth-helpers-react";
import { Logo } from "./navbar/Logo";
import { NavItems } from "./navbar/NavItems";
import { UserMenu } from "./navbar/UserMenu";
import { MobileMenu } from "./navbar/MobileMenu";

export default function Navbar() {
  const session = useSession();
  
  return (
    <div className="bg-background border-b">
      <div className="container flex items-center justify-between py-2">
        <Logo />
        <NavItems />
        <UserMenu session={session} />
        <MobileMenu session={session} />
      </div>
    </div>
  );
}
