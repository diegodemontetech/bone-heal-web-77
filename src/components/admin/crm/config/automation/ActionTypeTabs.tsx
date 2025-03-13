
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ActionData {
  subject: string;
  content: string;
  to_field: string;
}

interface ActionTypeTabsProps {
  activeTab: string;
  actionData: ActionData;
  onTabChange: (value: string) => void;
  onActionDataChange: (name: string, value: string) => void;
}

export function ActionTypeTabs({ 
  activeTab, 
  actionData, 
  onTabChange, 
  onActionDataChange 
}: ActionTypeTabsProps) {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onActionDataChange(name, value);
  };

  return (
    <div className="space-y-4">
      <Label>Tipo de Ação</Label>
      <Tabs value={activeTab} onValueChange={onTabChange}>
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
              value={actionData.subject}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              name="content"
              rows={6}
              value={actionData.content}
              onChange={handleInputChange}
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
              value={actionData.content}
              onChange={handleInputChange}
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
              value={actionData.content}
              onChange={handleInputChange}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
