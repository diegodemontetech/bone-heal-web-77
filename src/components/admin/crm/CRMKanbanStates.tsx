
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Carregando..." }: LoadingStateProps) => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2">{message}</span>
  </div>
);

interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => (
  <div className="flex items-center justify-center h-64 text-muted-foreground">
    {message}
  </div>
);
