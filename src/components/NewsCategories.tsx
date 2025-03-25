
import { Button } from "@/components/ui/button";

interface NewsCategoriesProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const NewsCategories = ({
  categories,
  selectedCategory,
  onCategorySelect,
}: NewsCategoriesProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Categorias</h2>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => onCategorySelect(null)}
          className={selectedCategory === null ? "bg-primary text-white" : ""}
        >
          Todas
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => onCategorySelect(category)}
            className={selectedCategory === category ? "bg-primary text-white" : ""}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default NewsCategories;
