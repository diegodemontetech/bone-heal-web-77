
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Search, RefreshCw, Phone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface LeadsListProps {
  selectedLeadId: string | null;
  onSelectLead: (lead: any) => void;
  onRefreshRequested: () => void;
}

const LeadsList = ({ selectedLeadId, onSelectLead, onRefreshRequested }: LeadsListProps) => {
  const [leads, setLeads] = useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLeads();
    
    // Inscrever-se para atualizações de leads
    const subscription = supabase
      .channel('leads-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'leads' 
      }, () => {
        fetchLeads();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLeads(leads);
    } else {
      const normalizedSearch = searchTerm.toLowerCase();
      setFilteredLeads(leads.filter(lead => 
        (lead.name && lead.name.toLowerCase().includes(normalizedSearch)) ||
        (lead.phone && lead.phone.includes(normalizedSearch))
      ));
    }
  }, [searchTerm, leads]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('last_contact', { ascending: false });
        
      if (error) throw error;
      
      setLeads(data || []);
      setFilteredLeads(data || []);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      toast.error('Erro ao carregar contatos');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLeads();
    onRefreshRequested();
    setRefreshing(false);
  };
  
  const getStatusColor = (status: string, needsHuman: boolean) => {
    if (needsHuman) return 'bg-red-100 text-red-800 border-red-200';
    
    switch (status) {
      case 'novo': return 'bg-green-100 text-green-800 border-green-200';
      case 'aguardando': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'atendido_bot': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'atendido_humano': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusLabel = (status: string, needsHuman: boolean) => {
    if (needsHuman) return 'Aguardando Atendente';
    
    switch (status) {
      case 'novo': return 'Novo';
      case 'aguardando': return 'Aguardando';
      case 'atendido_bot': return 'Atendido Bot';
      case 'atendido_humano': return 'Atendido';
      default: return status;
    }
  };

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-medium">Contatos</h3>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar contatos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            {searchTerm ? 'Nenhum contato encontrado.' : 'Nenhum contato disponível.'}
          </div>
        ) : (
          <div className="divide-y">
            {filteredLeads.map((lead) => (
              <div 
                key={lead.id}
                className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedLeadId === lead.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => onSelectLead(lead)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {lead.needs_human ? (
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-800">
                        <User className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800">
                        {lead.name ? lead.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                      </div>
                    )}
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium truncate">{lead.name || 'Sem nome'}</p>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getStatusColor(lead.status, lead.needs_human)}`}
                      >
                        {getStatusLabel(lead.status, lead.needs_human)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span className="truncate">{lead.phone}</span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      {lead.last_contact && formatDistanceToNow(new Date(lead.last_contact), { 
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsList;
