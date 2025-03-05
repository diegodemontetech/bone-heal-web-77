
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface NewsTableProps {
  onEdit: (news: any) => void;
  onDelete?: () => void;
}

export const NewsTable = ({ onEdit, onDelete }: NewsTableProps) => {
  const { toast } = useToast();
  
  const { data: news, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-news"],
    queryFn: async () => {
      console.log("Buscando notícias do banco de dados...");
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false });
      
      if (error) {
        console.error("Erro ao buscar notícias:", error);
        throw error;
      }
      
      console.log("Notícias recuperadas:", data);
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("news")
        .delete()
        .eq("id", id);
  
      if (error) {
        toast({
          title: "Erro ao excluir notícia",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
  
      toast({
        title: "Notícia excluída com sucesso",
      });
      refetch();
      if (onDelete) onDelete();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir notícia",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
        <span>Carregando notícias...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Erro ao carregar notícias. Por favor, tente novamente.
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        Nenhuma notícia encontrada. Clique em "Nova Notícia" para criar uma.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Imagem</TableHead>
          <TableHead>Título</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Data de Publicação</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {news.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              {item.featured_image && (
                <img
                  src={item.featured_image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/100x100/png?text=Sem+Imagem";
                  }}
                />
              )}
            </TableCell>
            <TableCell>{item.title}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>
              {new Date(item.published_at).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(item)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDelete(item.id)}
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
