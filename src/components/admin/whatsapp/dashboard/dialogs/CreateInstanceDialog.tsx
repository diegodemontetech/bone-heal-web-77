
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { CreateInstanceDialogProps } from '@/components/admin/whatsapp/types';

export const CreateInstanceDialog = ({
  isOpen,
  isCreating,
  onClose,
  onOpenChange,
  onCreateInstance
}: CreateInstanceDialogProps) => {
  const [instanceName, setInstanceName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!instanceName.trim()) {
      setError('Nome da instância é obrigatório');
      return;
    }
    
    setError('');
    
    try {
      const result = await onCreateInstance(instanceName);
      if (result) {
        setInstanceName('');
        onClose();
      }
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      setError('Falha ao criar instância. Tente novamente.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Instância</DialogTitle>
          <DialogDescription>
            Digite um nome para sua nova instância do WhatsApp.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="instanceName">Nome da Instância</Label>
            <Input
              id="instanceName"
              value={instanceName}
              onChange={(e) => setInstanceName(e.target.value)}
              placeholder="Ex: Atendimento Vendas"
              disabled={isCreating}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline" 
              onClick={onClose}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isCreating || !instanceName.trim()}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Instância'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
