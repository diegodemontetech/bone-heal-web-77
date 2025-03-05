
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";

interface StudiesFormProps {
  editingStudy: any | null;
  handleCloseForm: () => void;
  refetchStudies: () => void;
}

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
    description: editingStudy?.description || "",
    published_date: editingStudy?.published_date || "",
    file_url: editingStudy?.file_url || "",
  });

  const createStudyMutation = useMutation({
    mutationFn: async (studyData: typeof formData & { file_url: string }) => {
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
    mutationFn: async (studyData: typeof formData & { id: string }) => {
      console.log("Atualizando estudo:", studyData);
      const { error } = await supabase
        .from("scientific_studies")
        .update({
          title: studyData.title,
          description: studyData.description,
          published_date: studyData.published_date,
          file_url: studyData.file_url,
        })
        .eq("id", studyData.id);

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

      const studyData = { 
        ...formData, 
        file_url: fileUrl 
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
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
