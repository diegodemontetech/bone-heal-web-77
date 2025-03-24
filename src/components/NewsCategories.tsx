
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface NewsCategoriesProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const NewsCategories = ({ 
  categories = ["Odontologia", "Pesquisa", "Inovação", "Eventos", "Tecnologia"], 
  selectedCategory, 
  onCategorySelect 
}: NewsCategoriesProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap gap-3 mb-10"
    >
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        className="rounded-full"
        onClick={() => onCategorySelect(null)}
      >
        Todas
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          className="rounded-full"
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </Button>
      ))}
    </motion.div>
  );
};

export default NewsCategories;
