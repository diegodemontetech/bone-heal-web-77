
import { useState } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ContactListProps {
  contacts: any[] | null;
  isLoading: boolean;
}

const ContactList = ({ contacts, isLoading }: ContactListProps) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Nenhum contato encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          Quando contatos forem enviados pelo formulário do site, eles aparecerão aqui.
        </p>
      </div>
    );
  }

  const getStatusBadge = (replied: boolean) => {
    if (replied) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3.5 w-3.5 mr-1" /> Respondido</Badge>;
    }
    return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><AlertCircle className="h-3.5 w-3.5 mr-1" /> Aguardando</Badge>;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Assunto</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell className="max-w-xs truncate">{contact.subject}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(contact.created_at), { 
                  addSuffix: true,
                  locale: ptBR
                })}
              </TableCell>
              <TableCell>{getStatusBadge(contact.respondido || contact.replied)}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/admin/contacts/${contact.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContactList;
