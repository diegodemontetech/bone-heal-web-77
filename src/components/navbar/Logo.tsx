
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center ml-0 pl-0">
      <img 
        src="/lovable-uploads/c5a855af-42eb-4ffd-8fa0-bacd9ce220b3.png" 
        alt="BoneHeal" 
        className="h-8 md:h-10 object-contain"
      />
    </Link>
  );
};
