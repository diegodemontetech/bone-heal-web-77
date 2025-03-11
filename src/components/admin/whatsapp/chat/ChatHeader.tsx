
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MoreVertical, RefreshCw } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ChatHeaderProps {
  selectedLead: any;
}

const ChatHeader = ({ selectedLead }: ChatHeaderProps) => {
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefreshStatus = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', selectedLead.id)
        .single();
        
      if (error) throw error;
      
      // Atualizar dados na UI
      selectedLead.last_contact = data.last_contact;
      
      toast.success('Status atualizado');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Falha ao atualizar status');
    } finally {
      setRefreshing(false);
    }
  };
  
  const handleCall = () => {
    const phoneNumber = selectedLead.phone.replace(/\D/g, '');
    window.open(`tel:${phoneNumber}`);
  };

  return (
    <div className="border-b p-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Avatar>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            {selectedLead.name ? selectedLead.name.charAt(0).toUpperCase() : '?'}
          </div>
        </Avatar>
        
        <div>
          <h3 className="font-medium">{selectedLead.name || 'Contato'}</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{selectedLead.phone}</p>
            {selectedLead.last_contact && (
              <span className="text-xs text-muted-foreground">
                • {formatDistanceToNow(new Date(selectedLead.last_contact), { 
                  addSuffix: true,
                  locale: ptBR 
                })}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleRefreshStatus}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
        
        <Button variant="ghost" size="icon" onClick={handleCall}>
          <Phone className="h-4 w-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Ver detalhes do lead</DropdownMenuItem>
            <DropdownMenuItem>Adicionar anotação</DropdownMenuItem>
            <DropdownMenuItem>Agendar ação</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;
