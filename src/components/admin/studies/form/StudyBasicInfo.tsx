
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudyCategory } from "@/types/scientific-study";

const categoryOptions: { value: StudyCategory; label: string }[] = [
  { value: "clinical-case", label: "Caso Clínico" },
  { value: "systematic-review", label: "Revisão Sistemática" },
  { value: "randomized-trial", label: "Ensaio Clínico Randomizado" },
  { value: "laboratory-study", label: "Estudo Laboratorial" },
  { value: "other", label: "Outro" }
];

interface StudyBasicInfoProps {
  formData: {
    title: string;
    authors: string;
    journal: string;
    year: string;
    published_date: string;
    category: string;
    tags: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const StudyBasicInfo = ({ formData, setFormData }: StudyBasicInfoProps) => {
  return (
    <>
      <div className="col-span-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="authors">Autores</Label>
        <Input
          id="authors"
          value={formData.authors}
          onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
          required
          placeholder="Separados por vírgula"
        />
      </div>
      
      <div>
        <Label htmlFor="journal">Periódico/Revista</Label>
        <Input
          id="journal"
          value={formData.journal}
          onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="year">Ano</Label>
        <Input
          id="year"
          type="number"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          required
          min="1900"
          max={new Date().getFullYear().toString()}
        />
      </div>
      
      <div>
        <Label htmlFor="published_date">Data de Publicação</Label>
        <Input
          id="published_date"
          type="date"
          value={formData.published_date}
          onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="Separadas por vírgula"
        />
      </div>
    </>
  );
};
