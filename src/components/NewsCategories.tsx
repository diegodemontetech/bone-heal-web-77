
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NewsCategoriesProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const NewsCategories = ({ categories, selectedCategory, onCategorySelect }: NewsCategoriesProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => onCategorySelect(null)}
          className="mb-2"
        >
          Todas as Notícias
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => onCategorySelect(category)}
            className="mb-2"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default NewsCategories;
