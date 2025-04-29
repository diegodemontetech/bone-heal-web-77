
import { Loader2 } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">Carregando...</p>
      </div>
    </div>
  );
};

export default PageLoader;
