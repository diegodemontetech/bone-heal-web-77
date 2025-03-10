
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailTemplateForm } from "@/components/admin/EmailTemplateForm";
import { EmailLogs } from "@/components/admin/EmailLogs";

const EmailTemplates = () => {
  const [selectedTab, setSelectedTab] = useState("templates");
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: templates, isLoading, refetch } = useQuery({
    queryKey: ["email-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setIsCreating(false);
    setSelectedTab("edit");
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setIsCreating(true);
    setSelectedTab("create");
  };

  const handleSuccess = () => {
    refetch();
    setSelectedTab("templates");
    setEditingTemplate(null);
    setIsCreating(false);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Templates de Email</CardTitle>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Template
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              {isCreating && <TabsTrigger value="create">Criar</TabsTrigger>}
              {editingTemplate && <TabsTrigger value="edit">Editar</TabsTrigger>}
            </TabsList>

            <TabsContent value="templates" className="space-y-4 mt-6">
              {templates && templates.length > 0 ? (
                <div className="grid gap-4">
                  {templates.map((template) => (
                    <Card key={template.id}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Evento: {template.event_type}
                          </p>
                        </div>
                        <Button variant="outline" onClick={() => handleEdit(template)}>
                          Editar
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p>Nenhum template encontrado.</p>
                  <Button onClick={handleCreate} className="mt-4">
                    Criar Template
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="logs" className="mt-6">
              <EmailLogs />
            </TabsContent>

            <TabsContent value="create" className="mt-6">
              {isCreating && (
                <EmailTemplateForm onSuccess={handleSuccess} />
              )}
            </TabsContent>

            <TabsContent value="edit" className="mt-6">
              {editingTemplate && (
                <EmailTemplateForm
                  template={editingTemplate}
                  onSuccess={handleSuccess}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTemplates;
