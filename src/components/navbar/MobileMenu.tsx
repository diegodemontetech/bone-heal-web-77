
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NavItems } from "./NavItems";

export const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm border-none">
        <div className="flex flex-col space-y-3 text-center sm:text-left">
          <NavItems mobile />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileMenu;
