
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScientificStudy } from "@/types/scientific-study";

export const useStudyForm = (
  editingStudy: ScientificStudy | null,
  handleCloseForm: () => void,
  refetchStudies: () => void
) => {
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

  return {
    formData,
    setFormData,
    isUploading,
    handleFileChange,
    handleSubmit,
    editingStudy
  };
};
