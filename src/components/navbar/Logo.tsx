
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export const Logo = () => {
  const isMobile = useIsMobile();

  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/lovable-uploads/c5a855af-42eb-4ffd-8fa0-bacd9ce220b3.png" 
        alt="BoneHeal" 
        className={`${isMobile ? 'h-6 pl-0' : 'h-8 md:h-10'} object-contain`}
      />
    </Link>
  );
};
