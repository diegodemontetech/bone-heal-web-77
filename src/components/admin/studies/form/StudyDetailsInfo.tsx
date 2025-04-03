
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface StudyDetailsInfoProps {
  formData: {
    description: string;
    abstract: string;
    doi: string;
    url: string;
    citation: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const StudyDetailsInfo = ({ formData, setFormData }: StudyDetailsInfoProps) => {
  return (
    <>
      <div className="col-span-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          className="h-24"
        />
      </div>
      
      <div className="col-span-2">
        <Label htmlFor="abstract">Resumo/Abstract</Label>
        <Textarea
          id="abstract"
          value={formData.abstract}
          onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
          className="h-32"
        />
      </div>
      
      <div>
        <Label htmlFor="doi">DOI</Label>
        <Input
          id="doi"
          value={formData.doi}
          onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
          placeholder="ex: 10.1016/j.joms.2021.03.005"
        />
      </div>
      
      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="Link externo para o artigo"
        />
      </div>
      
      <div className="col-span-2">
        <Label htmlFor="citation">Citação Completa</Label>
        <Textarea
          id="citation"
          value={formData.citation}
          onChange={(e) => setFormData({ ...formData, citation: e.target.value })}
          placeholder="Formato ABNT, APA ou similar"
          className="h-20"
        />
      </div>
    </>
  );
};
