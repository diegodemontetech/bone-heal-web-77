
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/Layout";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StudiesTable } from "@/components/admin/studies/StudiesTable";
import { StudiesForm } from "@/components/admin/studies/StudiesForm";

const AdminStudies = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<any>(null);

  const handleEdit = (study: any) => {
    setEditingStudy(study);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingStudy(null);
  };

  const refetchStudies = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-studies"] });
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

        <div className="bg-white rounded-lg shadow">
          <StudiesTable onEdit={handleEdit} />
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStudy ? "Editar Estudo" : "Novo Estudo Científico"}</DialogTitle>
              <DialogDescription>
                Preencha os dados do estudo científico e faça upload do arquivo PDF.
              </DialogDescription>
            </DialogHeader>
            <StudiesForm 
              editingStudy={editingStudy}
              handleCloseForm={handleCloseForm}
              refetchStudies={refetchStudies}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminStudies;
