
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
import { Pencil, Trash2, Loader2, FileText, Link2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScientificStudy } from "@/types/scientific-study";

interface StudiesTableProps {
  onEdit: (study: ScientificStudy) => void;
}

export const StudiesTable = ({ onEdit }: StudiesTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: studies, isLoading, error } = useQuery({
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
        return data as ScientificStudy[];
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

  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case "clinical-case":
        return "Caso Clínico";
      case "systematic-review":
        return "Revisão Sistemática";
      case "randomized-trial":
        return "Ensaio Clínico";
      case "laboratory-study":
        return "Estudo Laboratorial";
      default:
        return "Outro";
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "clinical-case":
        return "bg-blue-100 text-blue-800";
      case "systematic-review":
        return "bg-purple-100 text-purple-800";
      case "randomized-trial":
        return "bg-green-100 text-green-800";
      case "laboratory-study":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          <TableHead>Autores</TableHead>
          <TableHead>Periódico</TableHead>
          <TableHead>Ano</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Recursos</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {studies.map((study) => (
          <TableRow key={study.id}>
            <TableCell className="font-medium">{study.title}</TableCell>
            <TableCell>{study.authors}</TableCell>
            <TableCell>{study.journal}</TableCell>
            <TableCell>{study.year}</TableCell>
            <TableCell>
              {study.category && (
                <Badge className={getCategoryColor(study.category)}>
                  {getCategoryLabel(study.category)}
                </Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {study.file_url && (
                  <a
                    href={study.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary-dark"
                  >
                    <FileText className="w-4 h-4" />
                  </a>
                )}
                {study.url && (
                  <a
                    href={study.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary-dark"
                  >
                    <Link2 className="w-4 h-4" />
                  </a>
                )}
                {study.doi && (
                  <a
                    href={`https://doi.org/${study.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary-dark"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                )}
              </div>
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
