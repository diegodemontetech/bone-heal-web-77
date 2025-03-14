
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ActionItemProps } from "./ActionItem";
import ActionItem from "./ActionItem";

interface CategorySectionProps {
  title: string;
  value: string;
  items: Omit<ActionItemProps, "onDragStart">[];
  searchTerm: string;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeData: any) => void;
}

const CategorySection = ({ title, value, items, searchTerm, onDragStart }: CategorySectionProps) => {
  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="px-2 text-sm font-semibold">{title}</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          {filteredItems.map((item, index) => (
            <ActionItem
              key={index}
              {...item}
              onDragStart={onDragStart}
            />
          ))}
          {filteredItems.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              Nenhum item encontrado
            </p>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CategorySection;
