
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusColors = {
  open: "bg-green-100 text-green-800",
  "in-progress": "bg-blue-100 text-blue-800",
  resolved: "bg-gray-100 text-gray-800",
};

const TicketList = () => {
  const navigate = useNavigate();
  const { data: tickets, isLoading } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: async () => {
      const { data: tickets, error } = await supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return tickets;
    },
  });

  const handleViewTicket = (id: string) => {
    navigate(`/support/tickets/${id}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Assunto</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              Carregando...
            </TableCell>
          </TableRow>
        ) : tickets?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              Nenhum chamado encontrado
            </TableCell>
          </TableRow>
        ) : (
          tickets?.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>#{ticket.number}</TableCell>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={statusColors[ticket.status as keyof typeof statusColors]}
                >
                  {ticket.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(ticket.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewTicket(ticket.id)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ver Detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default TicketList;
