
import { useSession } from "@supabase/auth-helpers-react";
import { Logo } from "./navbar/Logo";
import { NavItems } from "./navbar/NavItems";
import { UserMenu } from "./navbar/UserMenu";
import { MobileMenu } from "./navbar/MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationsBell from "./navbar/NotificationsBell";

export default function Navbar() {
  const session = useSession();
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-background border-b sticky top-0 z-50">
      <div className="container flex items-center justify-between py-2">
        <div className="flex items-center">
          <Logo />
        </div>
        
        <div className="hidden md:flex items-center justify-center flex-1">
          <NavItems />
        </div>
        
        <div className="flex items-center justify-end gap-2">
          {session && <NotificationsBell />}
          {!isMobile && <UserMenu session={session} />}
          {isMobile && <MobileMenu session={session} />}
        </div>
      </div>
    </div>
  );
}
