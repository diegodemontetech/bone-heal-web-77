
import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="container max-w-4xl py-10 flex justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default LoadingState;
