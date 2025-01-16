import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AdminStudies = () => {
  const { toast } = useToast();
  const { data: studies, refetch } = useQuery({
    queryKey: ["admin-studies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scientific_studies")
        .select("*")
        .order("published_date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("scientific_studies")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir estudo",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Estudo excluído com sucesso",
    });
    refetch();
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Estudos Científicos</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Estudo
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Data de Publicação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studies?.map((study) => (
                <TableRow key={study.id}>
                  <TableCell>{study.title}</TableCell>
                  <TableCell>
                    {new Date(study.published_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon">
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStudies;