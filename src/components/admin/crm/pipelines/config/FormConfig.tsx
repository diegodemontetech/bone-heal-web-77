
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, ExternalLink, ClipboardCopy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Pipeline, CRMField } from "@/types/crm";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FormConfigProps {
  pipelineId: string;
  pipeline: Pipeline;
}

export const FormConfig = ({ pipelineId, pipeline }: FormConfigProps) => {
  const [fields, setFields] = useState<CRMField[]>([]);
  const [formUrl, setFormUrl] = useState(pipeline.form_url || "");
  const [embedCode, setEmbedCode] = useState("");
  const [activeTab, setActiveTab] = useState("config");
  const [isPublic, setIsPublic] = useState(true);
  const [customSuccessMessage, setCustomSuccessMessage] = useState("");
  const [customRedirectUrl, setCustomRedirectUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchFields();
    generateEmbedCode();
  }, [pipelineId, formUrl]);

  const fetchFields = async () => {
    try {
      const { data, error } = await supabase
        .from("crm_fields")
        .select("*")
        .eq("pipeline_id", pipelineId)
        .order("created_at");

      if (error) throw error;
      setFields(data || []);
    } catch (err) {
      console.error("Erro ao buscar campos:", err);
      toast.error("Erro ao carregar campos");
    }
  };

  const generateEmbedCode = () => {
    const baseUrl = window.location.origin;
    const embedUrl = `${baseUrl}/forms/${pipelineId}`;
    
    setFormUrl(embedUrl);
    
    const code = `<iframe 
  src="${embedUrl}" 
  width="100%" 
  height="600px" 
  style="border:none;border-radius:4px;box-shadow:0 2px 10px rgba(0,0,0,0.1);" 
  title="${pipeline.name} - Formulário"
></iframe>`;
    
    setEmbedCode(code);
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(message);
    }).catch(err => {
      console.error('Erro ao copiar para o clipboard:', err);
      toast.error("Não foi possível copiar para a área de transferência");
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const formSettings = {
        is_public: isPublic,
        success_message: customSuccessMessage,
        redirect_url: customRedirectUrl
      };
      
      // Atualizar configurações do formulário
      const { error: settingsError } = await supabase
        .from("crm_form_settings")
        .upsert({
          pipeline_id: pipelineId,
          ...formSettings
        });
        
      if (settingsError) throw settingsError;
      
      // Atualizar URL do formulário no pipeline
      const { error: pipelineError } = await supabase
        .from("crm_pipelines")
        .update({ form_url: formUrl })
        .eq("id", pipelineId);
        
      if (pipelineError) throw pipelineError;
      
      toast.success("Configurações do formulário salvas com sucesso");
    } catch (err) {
      console.error("Erro ao salvar configurações:", err);
      toast.error("Erro ao salvar configurações do formulário");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid grid-cols-2 w-full mb-4">
        <TabsTrigger value="config">Configurações</TabsTrigger>
        <TabsTrigger value="embed">Embed</TabsTrigger>
      </TabsList>
      
      <TabsContent value="config">
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Formulário</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {fields.length === 0 ? (
                <Alert variant="destructive">
                  <AlertTitle>Nenhum campo configurado</AlertTitle>
                  <AlertDescription>
                    Você precisa adicionar campos na aba "Campos" antes de configurar o formulário.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_public"
                        checked={isPublic}
                        onCheckedChange={setIsPublic}
                      />
                      <Label htmlFor="is_public">Formulário público</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Se desativado, o formulário só estará disponível para usuários autenticados
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="success_message">Mensagem de sucesso</Label>
                    <Textarea
                      id="success_message"
                      placeholder="Obrigado pelo contato! Entraremos em contato em breve."
                      value={customSuccessMessage}
                      onChange={(e) => setCustomSuccessMessage(e.target.value)}
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground">
                      Mensagem exibida após o envio bem-sucedido do formulário
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="redirect_url">URL de redirecionamento (opcional)</Label>
                    <Input
                      id="redirect_url"
                      type="url"
                      placeholder="https://example.com/thank-you"
                      value={customRedirectUrl}
                      onChange={(e) => setCustomRedirectUrl(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Redirecionar para outra página após o envio do formulário
                    </p>
                  </div>

                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Salvando..." : "Salvar configurações"}
                  </Button>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="embed">
        <Card>
          <CardHeader>
            <CardTitle>Compartilhar Formulário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.length === 0 ? (
              <Alert variant="destructive">
                <AlertTitle>Nenhum campo configurado</AlertTitle>
                <AlertDescription>
                  Você precisa adicionar campos na aba "Campos" antes de compartilhar o formulário.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="form_url">Link direto</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="form_url"
                      value={formUrl}
                      readOnly
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => copyToClipboard(formUrl, "Link copiado para a área de transferência")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      asChild
                    >
                      <a href={formUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="embed_code">Código para embed</Label>
                  <div className="relative">
                    <Textarea
                      id="embed_code"
                      value={embedCode}
                      readOnly
                      rows={5}
                      className="font-mono text-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(embedCode, "Código copiado para a área de transferência")}
                    >
                      <ClipboardCopy className="h-4 w-4 mr-1" /> Copiar
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Copie e cole este código em seu site para incorporar o formulário
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
