
import { useState } from "react";
import { Link } from "react-router-dom";
import { DesktopNav } from "./navbar/DesktopNav";
import { MobileNav } from "./navbar/MobileNav";
import { UserMenu } from "./navbar/UserMenu";

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
        <UserMenu />
        <MobileNav open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}
