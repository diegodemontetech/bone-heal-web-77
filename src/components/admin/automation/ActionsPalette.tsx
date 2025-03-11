
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  MessageCircle, 
  Database, 
  CreditCard, 
  UserPlus, 
  AlertTriangle, 
  FileText, 
  Calendar, 
  Filter, 
  Bell 
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ActionItem {
  label: string;
  description: string;
  icon: JSX.Element;
  nodeType: string;
  type: string;
  service: string;
  action: string;
}

const ActionsPalette = () => {
  const [search, setSearch] = useState("");

  const triggers: ActionItem[] = [
    { 
      label: "Lead Criado", 
      description: "Ativa quando um novo lead é registrado", 
      icon: <UserPlus className="h-4 w-4" />, 
      nodeType: "triggerNode", 
      type: "trigger",
      service: "crm",
      action: "newLead"
    },
    { 
      label: "Pedido Realizado", 
      description: "Ativa quando um novo pedido é feito", 
      icon: <CreditCard className="h-4 w-4" />, 
      nodeType: "triggerNode", 
      type: "trigger",
      service: "orders",
      action: "newOrder"
    },
    { 
      label: "Mensagem WhatsApp", 
      description: "Ativa ao receber uma mensagem no WhatsApp", 
      icon: <MessageCircle className="h-4 w-4" />, 
      nodeType: "triggerNode", 
      type: "trigger",
      service: "whatsapp",
      action: "newMessage"
    },
    { 
      label: "Agendamento", 
      description: "Executa em uma programação definida", 
      icon: <Calendar className="h-4 w-4" />, 
      nodeType: "triggerNode", 
      type: "trigger",
      service: "scheduler",
      action: "cronJob"
    },
  ];

  const actions: ActionItem[] = [
    { 
      label: "Enviar Email", 
      description: "Envia uma mensagem por email", 
      icon: <Mail className="h-4 w-4" />, 
      nodeType: "actionNode", 
      type: "action",
      service: "email",
      action: "sendEmail"
    },
    { 
      label: "Enviar WhatsApp", 
      description: "Envia uma mensagem pelo WhatsApp", 
      icon: <MessageCircle className="h-4 w-4" />, 
      nodeType: "actionNode", 
      type: "action",
      service: "whatsapp",
      action: "sendMessage"
    },
    { 
      label: "Atualizar Database", 
      description: "Atualiza registros no banco de dados", 
      icon: <Database className="h-4 w-4" />, 
      nodeType: "actionNode", 
      type: "action",
      service: "database",
      action: "updateRecord"
    },
    { 
      label: "Notificação", 
      description: "Envia notificação para administradores", 
      icon: <Bell className="h-4 w-4" />, 
      nodeType: "actionNode", 
      type: "action",
      service: "notification",
      action: "sendNotification"
    },
    { 
      label: "Gerar PDF", 
      description: "Cria um documento PDF", 
      icon: <FileText className="h-4 w-4" />, 
      nodeType: "actionNode", 
      type: "action",
      service: "document",
      action: "generatePdf"
    },
  ];

  const conditions: ActionItem[] = [
    { 
      label: "Filtro", 
      description: "Condicional baseado em dados", 
      icon: <Filter className="h-4 w-4" />, 
      nodeType: "conditionNode", 
      type: "condition",
      service: "logic",
      action: "filter"
    },
    { 
      label: "Verificar Erro", 
      description: "Verifica se houve erro nas etapas anteriores", 
      icon: <AlertTriangle className="h-4 w-4" />, 
      nodeType: "conditionNode", 
      type: "condition",
      service: "logic",
      action: "errorCheck"
    },
  ];

  const filteredTriggers = triggers.filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredActions = actions.filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredConditions = conditions.filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeData: ActionItem) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card className="h-[600px] overflow-auto">
      <CardHeader>
        <CardTitle className="text-base">Ações e Gatilhos</CardTitle>
        <div className="mt-2">
          <Label htmlFor="search-actions" className="sr-only">Buscar</Label>
          <Input
            id="search-actions"
            placeholder="Buscar ações..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <Accordion type="multiple" defaultValue={["triggers", "actions", "conditions"]}>
          <AccordionItem value="triggers">
            <AccordionTrigger className="px-2 text-sm font-semibold">Gatilhos</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {filteredTriggers.map((trigger, index) => (
                  <div
                    key={index}
                    className="p-2 border rounded-md cursor-grab hover:bg-muted transition-colors"
                    draggable
                    onDragStart={(e) => onDragStart(e, trigger)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                        {trigger.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{trigger.label}</p>
                        <p className="text-xs text-muted-foreground">{trigger.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredTriggers.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">Nenhum gatilho encontrado</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="actions">
            <AccordionTrigger className="px-2 text-sm font-semibold">Ações</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {filteredActions.map((action, index) => (
                  <div
                    key={index}
                    className="p-2 border rounded-md cursor-grab hover:bg-muted transition-colors"
                    draggable
                    onDragStart={(e) => onDragStart(e, action)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-md text-blue-600">
                        {action.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{action.label}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredActions.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">Nenhuma ação encontrada</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="conditions">
            <AccordionTrigger className="px-2 text-sm font-semibold">Condições</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {filteredConditions.map((condition, index) => (
                  <div
                    key={index}
                    className="p-2 border rounded-md cursor-grab hover:bg-muted transition-colors"
                    draggable
                    onDragStart={(e) => onDragStart(e, condition)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-amber-100 rounded-md text-amber-600">
                        {condition.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{condition.label}</p>
                        <p className="text-xs text-muted-foreground">{condition.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredConditions.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">Nenhuma condição encontrada</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ActionsPalette;
