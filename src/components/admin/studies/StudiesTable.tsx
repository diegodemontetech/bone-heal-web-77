
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2 } from "lucide-react";

interface StudiesTableProps {
  onEdit: (study: any) => void;
}

export const StudiesTable = ({ onEdit }: StudiesTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: studies, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-studies"],
    queryFn: async () => {
      try {
        console.log("Buscando estudos científicos...");
        const { data, error } = await supabase
          .from("scientific_studies")
          .select("*")
          .order("published_date", { ascending: false });
        
        if (error) {
          console.error("Erro ao buscar estudos:", error);
          throw error;
        }
        
        console.log("Estudos científicos recuperados:", data);
        return data;
      } catch (error) {
        console.error("Falha ao buscar estudos:", error);
        throw error;
      }
    },
  });

  const deleteStudyMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Excluindo estudo:", id);
      const { error } = await supabase
        .from("scientific_studies")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Erro ao excluir estudo:", error);
        throw error;
      }
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

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este estudo?")) {
      deleteStudyMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
        <span>Carregando estudos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Erro ao carregar estudos. Por favor, tente novamente.
      </div>
    );
  }

  if (!studies || studies.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        Nenhum estudo científico encontrado. Clique em "Novo Estudo" para adicionar.
      </div>
    );
  }

  return (
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
        {studies.map((study) => (
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
                onClick={() => onEdit(study)}
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
        ))}
      </TableBody>
    </Table>
  );
};
