
import { useSession } from "@supabase/auth-helpers-react";
import { Logo } from "./navbar/Logo";
import { NavItems } from "./navbar/NavItems";
import { UserMenu } from "./navbar/UserMenu";
import { MobileMenu } from "./navbar/MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Navbar() {
  const session = useSession();
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-background border-b">
      <div className="container flex items-center justify-between py-2">
        <Logo />
        {!isMobile && <NavItems />}
        {!isMobile && <UserMenu session={session} />}
        {isMobile && <MobileMenu session={session} />}
      </div>
    </div>
  );
}
