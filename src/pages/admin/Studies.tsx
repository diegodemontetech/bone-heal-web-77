
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Upload, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminStudies = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingStudy, setEditingStudy] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    published_date: "",
    file_url: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: studies, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-studies"],
    queryFn: async () => {
      try {
        console.log("Fetching admin studies...");
        const { data, error } = await supabase
          .from("scientific_studies")
          .select("*")
          .order("published_date", { ascending: false });
        
        if (error) {
          console.error("Error fetching studies:", error);
          throw error;
        }
        
        console.log("Admin studies fetched:", data);
        return data;
      } catch (error) {
        console.error("Failed to fetch studies:", error);
        throw error;
      }
    },
  });

  const createStudyMutation = useMutation({
    mutationFn: async (studyData: typeof formData & { file_url: string }) => {
      const { error } = await supabase
        .from("scientific_studies")
        .insert([studyData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-studies"] });
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
      const { error } = await supabase
        .from("scientific_studies")
        .update({
          title: studyData.title,
          description: studyData.description,
          published_date: studyData.published_date,
          file_url: studyData.file_url,
        })
        .eq("id", studyData.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-studies"] });
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

  const deleteStudyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("scientific_studies")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-studies"] });
      toast({
        title: "Estudo excluído com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir estudo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (study: any) => {
    setEditingStudy(study);
    setFormData({
      title: study.title,
      description: study.description || "",
      published_date: study.published_date,
      file_url: study.file_url || "",
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingStudy(null);
    setFormData({
      title: "",
      description: "",
      published_date: "",
      file_url: "",
    });
    setSelectedFile(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este estudo?")) {
      deleteStudyMutation.mutate(id);
    }
  };

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

      const { error: uploadError } = await supabase.storage
        .from('studies_files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('studies_files')
        .getPublicUrl(filePath);

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
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Estudos Científicos</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Estudo
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Não foi possível carregar os estudos científicos. Por favor, tente novamente mais tarde.
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Data de Publicação</TableHead>
                <TableHead>Arquivo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </TableCell>
                </TableRow>
              ) : studies?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    Nenhum estudo científico encontrado. Clique em "Novo Estudo" para adicionar.
                  </TableCell>
                </TableRow>
              ) : (
                studies?.map((study) => (
                  <TableRow key={study.id}>
                    <TableCell>{study.title}</TableCell>
                    <TableCell>
                      {new Date(study.published_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {study.file_url ? (
                        <a
                          href={study.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-dark"
                        >
                          Ver PDF
                        </a>
                      ) : (
                        <span className="text-neutral-400">Sem arquivo</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(study)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(study.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStudy ? "Editar Estudo" : "Novo Estudo Científico"}</DialogTitle>
              <DialogDescription>
                Preencha os dados do estudo científico e faça upload do arquivo PDF.
              </DialogDescription>
            </DialogHeader>
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
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
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
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminStudies;
