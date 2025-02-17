
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailTemplateForm } from "@/components/admin/EmailTemplateForm";
import { EmailLogs } from "@/components/admin/EmailLogs";

export const EmailTemplates = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const { data: templates, refetch } = useQuery({
    queryKey: ["email-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from("email_templates")
        .update({ active: !currentActive })
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Template atualizado com sucesso!");
      refetch();
    } catch (error: any) {
      toast.error("Erro ao atualizar template: " + error.message);
    }
  };

  const handleEdit = (template: any) => {
    setSelectedTemplate(template);
    setIsEditDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <Tabs defaultValue="templates">
          <TabsList>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="templates">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">Templates de Email</h1>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Novo Template</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Novo Template de Email</DialogTitle>
                      </DialogHeader>
                      <EmailTemplateForm onSuccess={() => refetch()} />
                    </DialogContent>
                  </Dialog>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Evento</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Ativo</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates?.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell>{template.name}</TableCell>
                        <TableCell>{template.event_type}</TableCell>
                        <TableCell>{template.subject}</TableCell>
                        <TableCell>
                          <Switch
                            checked={template.active}
                            onCheckedChange={() => handleToggleActive(template.id, template.active)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(template)}
                          >
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <EmailLogs />
          </TabsContent>
        </Tabs>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Template</DialogTitle>
            </DialogHeader>
            <EmailTemplateForm 
              template={selectedTemplate}
              onSuccess={() => {
                refetch();
                setIsEditDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default EmailTemplates;
