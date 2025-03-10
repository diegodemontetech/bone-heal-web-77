
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img 
        src="/lovable-uploads/a1e6ee26-a267-49bf-a352-9df8b5791534.png" 
        alt="BoneHeal" 
        className="h-12 object-contain"
      />
    </Link>
  );
};
