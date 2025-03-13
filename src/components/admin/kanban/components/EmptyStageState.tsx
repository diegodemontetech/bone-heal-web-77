
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStageStateProps {
  message: string;
  actionLabel: string;
  actionLink: string;
}

const EmptyStageState = ({ message, actionLabel, actionLink }: EmptyStageStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center h-48 p-4">
        <p className="text-muted-foreground mb-4">{message}</p>
        <Button asChild>
          <Link to={actionLink}>{actionLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyStageState;
