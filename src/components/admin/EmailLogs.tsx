
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export const EmailLogs = () => {
  const { data: logs } = useQuery({
    queryKey: ["email-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_logs")
        .select(`
          *,
          email_templates (
            name,
            event_type
          )
        `)
        .order("sent_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Logs de Email</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Evento</TableHead>
              <TableHead>Destinatário</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs?.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {format(new Date(log.sent_at), "dd/MM/yyyy HH:mm")}
                </TableCell>
                <TableCell>{log.email_templates?.name}</TableCell>
                <TableCell>{log.email_templates?.event_type}</TableCell>
                <TableCell>{log.recipient_email}</TableCell>
                <TableCell>{log.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
