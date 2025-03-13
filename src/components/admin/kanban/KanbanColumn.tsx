
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KanbanColumnProps {
  title: string;
  count: number;
  color?: string;
  children: ReactNode;
}

const KanbanColumn = ({ title, count, color = "#3b82f6", children }: KanbanColumnProps) => {
  return (
    <Card className="h-[calc(100vh-250px)] flex flex-col">
      <CardHeader className="p-3 pb-0 flex flex-row justify-between items-center">
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="font-medium text-sm">{title}</h3>
          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
            {count}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto p-2">
        {children}
      </CardContent>
      <CardFooter className="p-2 border-t">
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Plus className="h-4 w-4 mr-1" />
          <span>Adicionar</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default KanbanColumn;
