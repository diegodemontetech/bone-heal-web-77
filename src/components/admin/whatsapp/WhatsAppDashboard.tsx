
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWhatsAppInstances } from '@/hooks/use-whatsapp-instances';
import { useWhatsAppMessages } from '@/hooks/use-whatsapp-messages';
import QRCode from 'react-qr-code';
import { WhatsAppInstance } from '@/types/automation';
import WhatsAppInstanceCard from './WhatsAppInstanceCard';
import WhatsAppChat from './WhatsAppChat';
import { toast } from 'sonner';

const WhatsAppDashboard = () => {
  const [newInstanceName, setNewInstanceName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<WhatsAppInstance | null>(null);
  const [activeContact, setActiveContact] = useState<string>('');

  const { 
    instances, 
    isLoading, 
    createInstance, 
    refreshQrCode,
    isCreating,
    fetchInstances
  } = useWhatsAppInstances();

  const { 
    messages, 
    loading: messagesLoading, 
    sendMessage 
  } = useWhatsAppMessages(
    selectedInstance?.id || '', 
    activeContact
  );

  const handleCreateInstance = async () => {
    if (!newInstanceName.trim()) {
      toast.error('O nome da instância é obrigatório');
      return;
    }

    try {
      await createInstance(newInstanceName);
      setNewInstanceName('');
      setIsDialogOpen(false);
      toast.success('Instância criada com sucesso');
    } catch (error) {
      toast.error('Erro ao criar instância');
      console.error(error);
    }
  };

  const handleDeleteInstance = async (instanceId: string) => {
    try {
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evolution-api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          instanceId
        }),
      });

      const { error } = await supabase
        .from('whatsapp_instances')
        .delete()
        .eq('id', instanceId);

      if (error) throw error;

      if (selectedInstance?.id === instanceId) {
        setSelectedInstance(null);
      }

      fetchInstances();
      toast.success('Instância excluída com sucesso');
    } catch (error) {
      console.error('Erro ao excluir instância:', error);
      toast.error('Erro ao excluir instância');
    }
  };

  const handleSelectInstance = (instance: WhatsAppInstance) => {
    setSelectedInstance(instance);
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedInstance || !activeContact) return false;
    return await sendMessage(message);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">WhatsApp Integration</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Instância
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Instância WhatsApp</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="instance-name">Nome da Instância</Label>
              <Input 
                id="instance-name" 
                value={newInstanceName} 
                onChange={(e) => setNewInstanceName(e.target.value)}
                placeholder="Ex: Atendimento"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreateInstance} disabled={isCreating}>
                {isCreating ? 'Criando...' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Instâncias</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : instances.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Nenhuma instância encontrada</p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Instância
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {instances.map((instance) => (
                    <WhatsAppInstanceCard
                      key={instance.id}
                      instance={instance}
                      onRefreshQr={refreshQrCode}
                      onSelect={handleSelectInstance}
                      onDelete={handleDeleteInstance}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedInstance ? (
            <WhatsAppChat
              messages={messages}
              isLoading={messagesLoading}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center py-20">
                <h2 className="text-xl font-bold mb-4">Chat WhatsApp</h2>
                <p className="text-muted-foreground mb-4">Selecione uma instância para iniciar o chat</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppDashboard;
