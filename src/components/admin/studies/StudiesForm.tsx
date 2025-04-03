
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ScientificStudy, StudyCategory } from "@/types/scientific-study";

interface StudiesFormProps {
  editingStudy: ScientificStudy | null;
  handleCloseForm: () => void;
  refetchStudies: () => void;
}

const categoryOptions: { value: StudyCategory; label: string }[] = [
  { value: "clinical-case", label: "Caso Clínico" },
  { value: "systematic-review", label: "Revisão Sistemática" },
  { value: "randomized-trial", label: "Ensaio Clínico Randomizado" },
  { value: "laboratory-study", label: "Estudo Laboratorial" },
  { value: "other", label: "Outro" }
];

export const StudiesForm = ({ 
  editingStudy, 
  handleCloseForm, 
  refetchStudies 
}: StudiesFormProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: editingStudy?.title || "",
    authors: editingStudy?.authors || "",
    journal: editingStudy?.journal || "",
    year: editingStudy?.year?.toString() || new Date().getFullYear().toString(),
    published_date: editingStudy?.published_date || "",
    description: editingStudy?.description || "",
    abstract: editingStudy?.abstract || "",
    doi: editingStudy?.doi || "",
    url: editingStudy?.url || "",
    file_url: editingStudy?.file_url || "",
    citation: editingStudy?.citation || "",
    category: editingStudy?.category || "clinical-case",
    tags: editingStudy?.tags?.join(", ") || "",
  });

  const createStudyMutation = useMutation({
    mutationFn: async (studyData: any) => {
      console.log("Criando novo estudo:", studyData);
      const { error } = await supabase
        .from("scientific_studies")
        .insert([studyData]);

      if (error) {
        console.error("Erro ao criar estudo:", error);
        throw error;
      }
    },
    onSuccess: () => {
      refetchStudies();
      toast({
        title: "Estudo criado com sucesso",
      });
      handleCloseForm();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar estudo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateStudyMutation = useMutation({
    mutationFn: async (studyData: any) => {
      console.log("Atualizando estudo:", studyData);
      const { id, ...updateData } = studyData;
      const { error } = await supabase
        .from("scientific_studies")
        .update(updateData)
        .eq("id", id);

      if (error) {
        console.error("Erro ao atualizar estudo:", error);
        throw error;
      }
    },
    onSuccess: () => {
      refetchStudies();
      toast({
        title: "Estudo atualizado com sucesso",
      });
      handleCloseForm();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar estudo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `studies/${fileName}`;

      // Verificar se o bucket existe primeiro
      const { data: buckets } = await supabase.storage.listBuckets();
      const studiesBucketExists = buckets?.some(bucket => bucket.name === 'studies_files');
      
      if (!studiesBucketExists) {
        // Criar o bucket se não existir
        const { error: createBucketError } = await supabase.storage.createBucket('studies_files', {
          public: true,
          fileSizeLimit: 20971520 // 20MB
        });
        
        if (createBucketError) {
          console.error("Erro ao criar bucket:", createBucketError);
          throw createBucketError;
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('studies_files')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Erro ao fazer upload do arquivo:", uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('studies_files')
        .getPublicUrl(filePath);

      console.log("Arquivo enviado com sucesso:", publicUrl);
      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Erro ao fazer upload do arquivo",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let fileUrl = formData.file_url;
      
      if (selectedFile) {
        fileUrl = await uploadFile(selectedFile);
      }

      // Process tags from comma-separated string to array
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim())
        : [];
      
      const studyData = { 
        ...formData,
        file_url: fileUrl,
        year: parseInt(formData.year),
        tags: tagsArray
      };

      if (editingStudy) {
        updateStudyMutation.mutate({ ...studyData, id: editingStudy.id });
      } else {
        createStudyMutation.mutate(studyData);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao salvar estudo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        
        <div className="col-span-2">
          <Label htmlFor="file">Arquivo PDF</Label>
          <div className="flex items-center gap-2">
            <Input
              id="file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="flex-1"
              required={!editingStudy || !formData.file_url}
            />
            {isUploading && (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            )}
          </div>
          {formData.file_url && (
            <div className="mt-2">
              <a 
                href={formData.file_url}
                target="_blank"
                rel="noopener noreferrer" 
                className="text-sm text-primary hover:text-primary-dark"
              >
                Arquivo atual
              </a>
            </div>
          )}
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isUploading}>
        {isUploading ? (
          <>
            <Upload className="w-4 h-4 mr-2 animate-bounce" />
            Enviando...
          </>
        ) : (
          editingStudy ? "Atualizar Estudo" : "Criar Estudo"
        )}
      </Button>
    </form>
  );
};
