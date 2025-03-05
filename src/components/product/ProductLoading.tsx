
import { Loader2 } from "lucide-react";

const ProductLoading = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
};

export default ProductLoading;
