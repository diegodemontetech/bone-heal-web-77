
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
  Bell,
  Clock,
  Timer,
  Tag,
  User,
  Infinity,
  Check,
  X,
  Edit,
  UploadCloud,
  Download,
  Trash2,
  Share2,
  GitMerge,
  GitBranch,
  ArrowRight,
  BarChart2,
  Percent,
  DollarSign,
  Briefcase,
  Target,
  Phone
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    { 
      label: "Formulário Enviado", 
      description: "Ativa quando um formulário é enviado", 
      icon: <Edit className="h-4 w-4" />, 
      nodeType: "triggerNode", 
      type: "trigger",
      service: "forms",
      action: "formSubmitted"
    },
    { 
      label: "Produto Criado", 
      description: "Ativa quando um produto é criado", 
      icon: <Briefcase className="h-4 w-4" />, 
      nodeType: "triggerNode", 
      type: "trigger",
      service: "products",
      action: "productCreated"
    },
    { 
      label: "Estágio de Lead Alterado", 
      description: "Ativa quando um lead muda de estágio", 
      icon: <GitBranch className="h-4 w-4" />, 
      nodeType: "triggerNode", 
      type: "trigger",
      service: "crm",
      action: "leadStageChanged"
    },
    { 
      label: "Email Recebido", 
      description: "Ativa quando um email é recebido", 
      icon: <Mail className="h-4 w-4" />, 
      nodeType: "triggerNode", 
      type: "trigger",
      service: "email",
      action: "emailReceived"
    },
    { 
      label: "Ticket de Suporte", 
      description: "Ativa quando um ticket é criado ou atualizado", 
      icon: <AlertTriangle className="h-4 w-4" />, 
      nodeType: "triggerNode", 
      type: "trigger",
      service: "support",
      action: "ticketCreated"
    },
    { 
      label: "Pagamento Confirmado", 
      description: "Ativa quando um pagamento é confirmado", 
      icon: <DollarSign className="h-4 w-4" />, 
      nodeType: "triggerNode", 
      type: "trigger",
      service: "payments",
      action: "paymentConfirmed"
    },
    { 
      label: "Gatilho Manual", 
      description: "Ativa manualmente pela interface", 
      icon: <Target className="h-4 w-4" />, 
      nodeType: "triggerNode", 
      type: "trigger",
      service: "manual",
      action: "manualTrigger"
    },
    { 
      label: "Webhook", 
      description: "Ativa por chamada de API externa", 
      icon: <Share2 className="h-4 w-4" />, 
      nodeType: "triggerNode", 
      type: "trigger",
      service: "webhook",
      action: "webhookReceived"
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
      label: "Criar Registro", 
      description: "Cria um novo registro no banco", 
      icon: <UploadCloud className="h-4 w-4" />, 
      nodeType: "actionNode", 
      type: "action",
      service: "database",
      action: "createRecord"
    },
    { 
      label: "Excluir Registro", 
      description: "Remove um registro do banco", 
      icon: <Trash2 className="h-4 w-4" />, 
      nodeType: "actionNode", 
      type: "action",
      service: "database",
      action: "deleteRecord"
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
    { 
      label: "Mover Lead", 
      description: "Move lead para outro estágio", 
      icon: <GitMerge className="h-4 w-4" />, 
      nodeType: "actionNode", 
      type: "action",
      service: "crm",
      action: "moveLead"
    },
    { 
      label: "Atribuir Lead", 
      description: "Atribui lead para um usuário", 
      icon: <User className="h-4 w-4" />, 
      nodeType: "actionNode", 
      type: "action",
      service: "crm",
      action: "assignLead"
    },
    { 
      label: "Iniciar SLA", 
      description: "Inicia um temporizador de SLA", 
      icon: <Timer className="h-4 w-4" />, 
      nodeType: "actionNode", 
      type: "action",
      service: "timer",
      action: "startTimer"
    },
    { 
      label: "Adicionar Tag", 
      description: "Adiciona etiqueta a um registro", 
      icon: <Tag className="h-4 w-4" />, 
      nodeType: "actionNode", 
      type: "action",
      service: "tag",
      action: "addTag"
    },
    { 
      label: "Remover Tag", 
      description: "Remove etiqueta de um registro", 
      icon: <Tag className="h-4 w-4" />, 
      nodeType: "actionNode", 
      type: "action",
      service: "tag",
      action: "removeTag"
    },
    { 
      label: "Fazer Chamada", 
      description: "Inicia uma chamada telefônica", 
      icon: <Phone className="h-4 w-4" />, 
      nodeType: "actionNode", 
      type: "action",
      service: "phone",
      action: "makeCall"
    },
    { 
      label: "Webhook Externo", 
      description: "Chama webhook de serviço externo", 
      icon: <Share2 className="h-4 w-4" />, 
      nodeType: "actionNode", 
      type: "action",
      service: "webhook",
      action: "callWebhook"
    },
    { 
      label: "Criar Usuário", 
      description: "Cria um novo usuário", 
      icon: <UserPlus className="h-4 w-4" />, 
      nodeType: "actionNode", 
      type: "action",
      service: "user",
      action: "createUser"
    },
    { 
      label: "Atualizar Função", 
      description: "Atualiza função de usuário", 
      icon: <User className="h-4 w-4" />, 
      nodeType: "actionNode", 
      type: "action",
      service: "user",
      action: "updateUserRole"
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
    { 
      label: "Comparar Valores", 
      description: "Compara dois valores", 
      icon: <Check className="h-4 w-4" />, 
      nodeType: "conditionNode", 
      type: "condition",
      service: "logic",
      action: "valueCompare"
    },
    { 
      label: "Verificar SLA", 
      description: "Verifica status de SLA", 
      icon: <Clock className="h-4 w-4" />, 
      nodeType: "conditionNode", 
      type: "condition",
      service: "logic",
      action: "slaCheck"
    },
    { 
      label: "Contém Tag", 
      description: "Verifica se contém uma etiqueta", 
      icon: <Tag className="h-4 w-4" />, 
      nodeType: "conditionNode", 
      type: "condition",
      service: "logic",
      action: "tagCheck"
    },
    { 
      label: "Verificar Status", 
      description: "Verifica status de um registro", 
      icon: <BarChart2 className="h-4 w-4" />, 
      nodeType: "conditionNode", 
      type: "condition",
      service: "logic",
      action: "statusCheck"
    },
    { 
      label: "Verificar Permissão", 
      description: "Verifica permissão de usuário", 
      icon: <User className="h-4 w-4" />, 
      nodeType: "conditionNode", 
      type: "condition",
      service: "logic",
      action: "permissionCheck"
    },
  ];

  const timers: ActionItem[] = [
    { 
      label: "Esperar", 
      description: "Aguarda por tempo determinado", 
      icon: <Clock className="h-4 w-4" />, 
      nodeType: "timerNode", 
      type: "timer",
      service: "timer",
      action: "delay"
    },
    { 
      label: "Agendamento", 
      description: "Executa em data/hora específica", 
      icon: <Calendar className="h-4 w-4" />, 
      nodeType: "timerNode", 
      type: "timer",
      service: "timer",
      action: "schedule"
    },
    { 
      label: "Expressão Cron", 
      description: "Executa em padrão recorrente", 
      icon: <Infinity className="h-4 w-4" />, 
      nodeType: "timerNode", 
      type: "timer",
      service: "timer",
      action: "cron"
    },
    { 
      label: "SLA", 
      description: "Monitora tempo de resposta", 
      icon: <Timer className="h-4 w-4" />, 
      nodeType: "timerNode", 
      type: "timer",
      service: "timer",
      action: "sla"
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

  const filteredTimers = timers.filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeData: ActionItem) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card className="h-[600px] overflow-hidden flex flex-col">
      <CardHeader className="pb-2">
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
      <CardContent className="p-2 flex-grow overflow-hidden">
        <ScrollArea className="h-[480px]">
          <Accordion type="multiple" defaultValue={["triggers", "actions", "conditions", "timers"]}>
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

            <AccordionItem value="timers">
              <AccordionTrigger className="px-2 text-sm font-semibold">Temporizadores</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {filteredTimers.map((timer, index) => (
                    <div
                      key={index}
                      className="p-2 border rounded-md cursor-grab hover:bg-muted transition-colors"
                      draggable
                      onDragStart={(e) => onDragStart(e, timer)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-100 rounded-md text-purple-600">
                          {timer.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{timer.label}</p>
                          <p className="text-xs text-muted-foreground">{timer.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredTimers.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">Nenhum temporizador encontrado</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActionsPalette;
