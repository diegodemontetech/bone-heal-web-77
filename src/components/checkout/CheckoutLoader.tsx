
import { Loader2 } from "lucide-react";

interface CheckoutLoaderProps {
  message?: string;
}

const CheckoutLoader = ({ message = "Carregando suas informações..." }: CheckoutLoaderProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">{message}</span>
    </div>
  );
};

export default CheckoutLoader;
