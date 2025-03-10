
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavItems } from "./NavItems";
import { UserMenu } from "./UserMenu";

interface MobileMenuProps {
  session?: any;
}

export const MobileMenu = ({ session }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden bg-muted/50 hover:bg-muted rounded-full p-2"
          >
            <Menu className="h-6 w-6 text-primary font-bold" strokeWidth={2.5} />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 pt-12 max-w-[280px]">
        <div className="flex flex-col h-full">
          <div className="px-4 py-2">
            <UserMenu session={session} mobile />
          </div>
          <div className="px-2 py-4 border-t flex-1">
            <NavItems mobile onClose={() => setOpen(false)} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
