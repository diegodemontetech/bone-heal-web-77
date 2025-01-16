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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, MessageCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WhatsAppMessagesPage = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingType, setEditingType] = useState<"question" | "final_greeting">("question");
  const [agentName, setAgentName] = useState("");
  const [agentPhoto, setAgentPhoto] = useState("");

  const { data: messages, isLoading, refetch } = useQuery({
    queryKey: ["whatsapp-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_messages_config")
        .select("*")
        .order("created_at", { ascending: true });
      
      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }

      // Set agent config if available
      const agentConfig = data.find(msg => msg.message_key === 'agent_config');
      if (agentConfig) {
        setAgentName(agentConfig.agent_name || '');
        setAgentPhoto(agentConfig.agent_photo || '');
      }
      
      return data.filter(msg => msg.message_key !== 'agent_config');
    },
  });

  const handleEdit = (id: string, text: string, type: "question" | "final_greeting") => {
    setEditingId(id);
    setEditingText(text);
    setEditingType(type);
  };

  const handleSave = async (id: string) => {
    try {
      const { error } = await supabase
        .from("whatsapp_messages_config")
        .update({ 
          message_text: editingText,
          message_type: editingType
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating message:", error);
        toast.error("Erro ao atualizar mensagem");
        return;
      }

      toast.success("Mensagem atualizada com sucesso");
      setEditingId(null);
      refetch();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao atualizar mensagem");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleAddMessage = async () => {
    try {
      const messageKey = `question_${Date.now()}`;
      const { error } = await supabase
        .from("whatsapp_messages_config")
        .insert([{
          message_key: messageKey,
          message_text: "Nova pergunta",
          message_type: "question"
        }]);

      if (error) {
        console.error("Error adding message:", error);
        toast.error("Erro ao adicionar mensagem");
        return;
      }

      toast.success("Mensagem adicionada com sucesso");
      refetch();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao adicionar mensagem");
    }
  };

  const handleSaveAgentConfig = async () => {
    try {
      const { data: existingConfig } = await supabase
        .from("whatsapp_messages_config")
        .select("*")
        .eq("message_key", "agent_config")
        .single();

      const updateData = {
        agent_name: agentName,
        agent_photo: agentPhoto,
      };

      let error;

      if (existingConfig) {
        ({ error } = await supabase
          .from("whatsapp_messages_config")
          .update(updateData)
          .eq("id", existingConfig.id));
      } else {
        ({ error } = await supabase
          .from("whatsapp_messages_config")
          .insert([{
            message_key: "agent_config",
            message_text: "",
            ...updateData
          }]));
      }

      if (error) {
        console.error("Error updating agent config:", error);
        toast.error("Erro ao atualizar configuração do agente");
        return;
      }

      toast.success("Configuração do agente atualizada com sucesso");
      refetch();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao atualizar configuração do agente");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mensagens do WhatsApp</h1>
          <Button onClick={handleAddMessage}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Pergunta
          </Button>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Agente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="agentName" className="text-sm font-medium">
                  Nome do Agente
                </label>
                <Input
                  id="agentName"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Nome do agente"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="agentPhoto" className="text-sm font-medium">
                  URL da Foto do Agente
                </label>
                <Input
                  id="agentPhoto"
                  value={agentPhoto}
                  onChange={(e) => setAgentPhoto(e.target.value)}
                  placeholder="URL da foto do agente"
                />
              </div>
              <Button onClick={handleSaveAgentConfig}>
                Salvar Configuração do Agente
              </Button>
            </CardContent>
          </Card>

          <Separator />

          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chave</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages?.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>{message.message_key}</TableCell>
                    <TableCell>
                      {editingId === message.id ? (
                        <Select
                          value={editingType}
                          onValueChange={(value: "question" | "final_greeting") => setEditingType(value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="question">Pergunta</SelectItem>
                            <SelectItem value="final_greeting">Saudação Final</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="inline-flex items-center">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          {message.message_type === "question" ? "Pergunta" : "Saudação Final"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === message.id ? (
                        <Input
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                        />
                      ) : (
                        message.message_text
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === message.id ? (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleSave(message.id)}
                          >
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(message.id, message.message_text, message.message_type)}
                        >
                          Editar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default WhatsAppMessagesPage;