
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Plus, Trash, Edit, Eye, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([
    { id: 1, name: "Boas-vindas", subject: "Bem-vindo à Boneheal", type: "account", lastEdited: "12/10/2023" },
    { id: 2, name: "Confirmação de Pedido", subject: "Seu pedido foi confirmado", type: "order", lastEdited: "14/10/2023" },
    { id: 3, name: "Envio de Pedido", subject: "Seu pedido foi enviado", type: "order", lastEdited: "14/10/2023" },
    { id: 4, name: "Recuperação de Senha", subject: "Recuperação de senha solicitada", type: "account", lastEdited: "10/10/2023" },
    { id: 5, name: "Notificação de Abandono de Carrinho", subject: "Itens no seu carrinho", type: "marketing", lastEdited: "08/10/2023" }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("content");
  
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    type: "account",
    content: "",
    htmlContent: ""
  });
  
  const resetForm = () => {
    setFormData({
      name: "",
      subject: "",
      type: "account",
      content: "",
      htmlContent: ""
    });
    setIsEditing(false);
    setCurrentTemplate(null);
    setActiveTab("content");
    setPreviewMode(false);
  };

  const openEditDialog = (template: any) => {
    setCurrentTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      type: template.type,
      content: "Conteúdo de exemplo do modelo de email " + template.name,
      htmlContent: `<h1>Olá, {{name}}!</h1><p>Este é um exemplo do modelo de email <strong>${template.name}</strong>.</p>`
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveTemplate = () => {
    if (!formData.name || !formData.subject) {
      toast.error("Por favor, preencha nome e assunto do modelo de email");
      return;
    }

    if (isEditing && currentTemplate) {
      // Atualizar modelo existente
      const updatedTemplates = templates.map(template => 
        template.id === currentTemplate.id ? 
        { 
          ...template, 
          name: formData.name, 
          subject: formData.subject, 
          type: formData.type,
          lastEdited: new Date().toLocaleDateString('pt-BR')
        } : 
        template
      );
      setTemplates(updatedTemplates);
      toast.success("Modelo de email atualizado com sucesso!");
    } else {
      // Criar novo modelo
      const newTemplate = {
        id: Math.max(...templates.map(t => t.id)) + 1,
        name: formData.name,
        subject: formData.subject,
        type: formData.type,
        lastEdited: new Date().toLocaleDateString('pt-BR')
      };
      setTemplates([...templates, newTemplate]);
      toast.success("Modelo de email criado com sucesso!");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteTemplate = (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este modelo de email?")) return;
    
    const updatedTemplates = templates.filter(template => template.id !== id);
    setTemplates(updatedTemplates);
    toast.success("Modelo de email excluído com sucesso!");
  };
  
  const copyTemplate = (id: number) => {
    const templateToCopy = templates.find(template => template.id === id);
    if (!templateToCopy) return;
    
    const newTemplate = {
      ...templateToCopy,
      id: Math.max(...templates.map(t => t.id)) + 1,
      name: `${templateToCopy.name} (cópia)`,
      lastEdited: new Date().toLocaleDateString('pt-BR')
    };
    
    setTemplates([...templates, newTemplate]);
    toast.success("Modelo de email duplicado com sucesso!");
  };

  const variables = [
    { name: "{{name}}", description: "Nome do cliente" },
    { name: "{{email}}", description: "Email do cliente" },
    { name: "{{order_number}}", description: "Número do pedido" },
    { name: "{{order_date}}", description: "Data do pedido" },
    { name: "{{shipping_address}}", description: "Endereço de entrega" },
    { name: "{{tracking_number}}", description: "Número de rastreamento" },
    { name: "{{product_list}}", description: "Lista de produtos" },
    { name: "{{total_amount}}", description: "Valor total" },
    { name: "{{payment_method}}", description: "Método de pagamento" }
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Mail className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Templates de Email</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Template de Email" : "Criar Novo Template de Email"}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Template</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Boas-vindas"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account">Conta</SelectItem>
                      <SelectItem value="order">Pedido</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="notification">Notificação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <Label htmlFor="subject">Assunto do Email</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Ex: Bem-vindo à Boneheal"
                />
              </div>
              
              <div className="border rounded-md">
                <div className="flex items-center justify-between p-2 border-b">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList>
                      <TabsTrigger value="content">Conteúdo</TabsTrigger>
                      <TabsTrigger value="html">HTML</TabsTrigger>
                      <TabsTrigger value="variables">Variáveis</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    {previewMode ? "Editar" : "Visualizar"}
                  </Button>
                </div>
                
                <div className="p-4">
                  <TabsContent value="content" className="m-0">
                    {previewMode ? (
                      <div className="min-h-[300px] p-4 border rounded-md bg-white">
                        {formData.content.split('\n').map((line, i) => (
                          <p key={i} className="mb-2">{line}</p>
                        ))}
                      </div>
                    ) : (
                      <Textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Digite o conteúdo do email..."
                        className="min-h-[300px]"
                      />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="html" className="m-0">
                    {previewMode ? (
                      <div 
                        className="min-h-[300px] p-4 border rounded-md bg-white"
                        dangerouslySetInnerHTML={{ __html: formData.htmlContent }}
                      />
                    ) : (
                      <Textarea
                        name="htmlContent"
                        value={formData.htmlContent}
                        onChange={handleInputChange}
                        placeholder="Digite ou cole o HTML do email..."
                        className="min-h-[300px] font-mono text-sm"
                      />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="variables" className="m-0">
                    <div className="min-h-[300px]">
                      <p className="text-sm text-muted-foreground mb-4">
                        Você pode usar estas variáveis no seu template para personalizar o conteúdo:
                      </p>
                      <div className="border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Variável</TableHead>
                              <TableHead>Descrição</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {variables.map((variable, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-mono">{variable.name}</TableCell>
                                <TableCell>{variable.description}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSaveTemplate}>
                  {isEditing ? "Atualizar" : "Criar"} Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Templates de Email</CardTitle>
          <CardDescription>
            Crie e edite templates para comunicação com seus clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Última Edição</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.subject}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template.type === 'account' ? 'bg-blue-100 text-blue-800' :
                      template.type === 'order' ? 'bg-green-100 text-green-800' :
                      template.type === 'marketing' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {template.type === 'account' ? 'Conta' :
                       template.type === 'order' ? 'Pedido' :
                       template.type === 'marketing' ? 'Marketing' :
                       template.type === 'notification' ? 'Notificação' :
                       template.type}
                    </span>
                  </TableCell>
                  <TableCell>{template.lastEdited}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => openEditDialog(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => copyTemplate(template.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTemplates;
