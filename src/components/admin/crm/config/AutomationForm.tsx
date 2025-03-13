
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CRMStage } from "@/types/crm";
import { SubmitButton } from "./fields/SubmitButton";

interface AutomationFormProps {
  onSuccess?: () => void;
}

export function AutomationForm({ onSuccess }: AutomationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [stages, setStages] = useState<CRMStage[]>([]);
  const [formData, setFormData] = useState({
    stage: "",
    next_stage: "",
    hours_trigger: 24,
    action_type: "email",
    action_data: {
      subject: "",
      content: "",
      to_field: "email"
    },
    is_active: true
  });
  const [activeTab, setActiveTab] = useState("email");

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    try {
      const { data, error } = await supabase
        .from("crm_stages")
        .select("*")
        .order("order", { ascending: true });

      if (error) {
        throw error;
      }

      setStages(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar estágios:", error);
      toast.error("Não foi possível carregar os estágios");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleActionDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      action_data: { ...prev.action_data, [name]: value }
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFormData(prev => ({ ...prev, action_type: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("crm_stage_automations")
        .insert([formData]);

      if (error) throw error;

      toast.success("Automação criada com sucesso!");
      
      // Reset form
      setFormData({
        stage: "",
        next_stage: "",
        hours_trigger: 24,
        action_type: "email",
        action_data: {
          subject: "",
          content: "",
          to_field: "email"
        },
        is_active: true
      });
      
      setActiveTab("email");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Erro ao criar automação:", error);
      toast.error(`Erro ao criar automação: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stage">Estágio de Trigger</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) => handleSelectChange("stage", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um estágio" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="next_stage">Próximo Estágio (opcional)</Label>
                <Select
                  value={formData.next_stage}
                  onValueChange={(value) => handleSelectChange("next_stage", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um estágio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Não mover</SelectItem>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hours_trigger">Gatilho de Tempo (horas)</Label>
              <Input
                id="hours_trigger"
                name="hours_trigger"
                type="number"
                value={formData.hours_trigger}
                onChange={handleChange}
                min={1}
              />
              <p className="text-sm text-muted-foreground">
                Tempo em horas que o lead deve permanecer no estágio antes da automação ser disparada
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Tipo de Ação</Label>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="sms">SMS</TabsTrigger>
                <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.action_data.subject}
                    onChange={handleActionDataChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo</Label>
                  <Textarea
                    id="content"
                    name="content"
                    rows={6}
                    value={formData.action_data.content}
                    onChange={handleActionDataChange}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="sms" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Mensagem SMS</Label>
                  <Textarea
                    id="content"
                    name="content"
                    rows={3}
                    value={formData.action_data.content}
                    onChange={handleActionDataChange}
                    maxLength={160}
                  />
                  <p className="text-sm text-muted-foreground">
                    Máximo de 160 caracteres
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="whatsapp" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Mensagem WhatsApp</Label>
                  <Textarea
                    id="content"
                    name="content"
                    rows={6}
                    value={formData.action_data.content}
                    onChange={handleActionDataChange}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="is_active">Automação Ativa</Label>
          </div>
          
          <SubmitButton isLoading={isLoading} />
        </form>
      </CardContent>
    </Card>
  );
}
