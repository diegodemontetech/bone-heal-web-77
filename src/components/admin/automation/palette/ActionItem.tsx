
import { LucideIcon } from "lucide-react";

export interface ActionItemProps {
  label: string;
  description: string;
  icon: JSX.Element;
  nodeType: string;
  type: string;
  service: string;
  action: string;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeData: any) => void;
}

const ActionItem = ({
  label,
  description,
  icon,
  nodeType,
  type,
  service,
  action,
  onDragStart
}: ActionItemProps) => {
  const getBgColor = () => {
    switch (type) {
      case "trigger":
        return "bg-primary/10 text-primary";
      case "action":
        return "bg-blue-100 text-blue-600";
      case "condition":
        return "bg-amber-100 text-amber-600";
      case "timer":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const nodeData = { label, description, icon, nodeType, type, service, action };

  return (
    <div
      className="p-2 border rounded-md cursor-grab hover:bg-muted transition-colors"
      draggable
      onDragStart={(e) => onDragStart(e, nodeData)}
    >
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-md ${getBgColor()}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ActionItem;
