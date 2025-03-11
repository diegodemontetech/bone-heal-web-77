
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DrawerHeaderProps {
  onClose: () => void;
}

export const DrawerHeader = ({ onClose }: DrawerHeaderProps) => {
  return (
    <SheetHeader className="mb-6">
      <div className="flex justify-between items-center">
        <SheetTitle>Detalhes do Lead</SheetTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </SheetHeader>
  );
};
