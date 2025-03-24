
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye } from "lucide-react";

interface ContactListProps {
  contacts: any[];
  isLoading: boolean;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-16" />
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum contato encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
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
              <TableCell>{contact.phone}</TableCell>
              <TableCell>{contact.reason || "Não informado"}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(contact.created_at), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </TableCell>
              <TableCell>
                <Badge
                  variant={contact.status === "contacted" ? "success" : "secondary"}
                >
                  {contact.status === "contacted" ? "Respondido" : "Aguardando"}
                </Badge>
              </TableCell>
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
