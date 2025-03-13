
import { cn } from "@/lib/utils";

interface TicketCategoryBadgeProps {
  category: string;
  label?: string;
}

const TicketCategoryBadge = ({ category, label }: TicketCategoryBadgeProps) => {
  const getColorByCategory = () => {
    switch (category) {
      case 'support':
        return 'bg-blue-100 text-blue-800';
      case 'sales':
        return 'bg-green-100 text-green-800';
      case 'logistics':
        return 'bg-orange-100 text-orange-800';
      case 'financial':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        getColorByCategory()
      )}
    >
      {label || category}
    </span>
  );
};

export default TicketCategoryBadge;
