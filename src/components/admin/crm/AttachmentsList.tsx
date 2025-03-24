
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Attachment } from "@/types/crm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, X, FileText, FileImage, File, Download, Trash2 } from "lucide-react";

export const AttachmentsList = ({ contactId }: { contactId: string }) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttachments();
  }, [contactId]);

  const fetchAttachments = async () => {
    try {
      setLoading(true);
      
      // Verificar se a tabela crm_attachments existe
      const { data, error } = await supabase
        .from('crm_attachments')
        .select('*')
        .eq('contact_id', contactId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Mapear os dados para o formato Attachment
      const formattedAttachments: Attachment[] = data.map((attachment: any) => ({
        id: attachment.id,
        file_name: attachment.file_name,
        file_url: attachment.file_url,
        file_type: attachment.file_type,
        created_at: attachment.created_at,
        contact_id: attachment.contact_id,
        user_id: attachment.user_id,
        user: attachment.user
      }));

      setAttachments(formattedAttachments);
    } catch (error) {
      console.error("Erro ao buscar anexos:", error);
      toast.error("Não foi possível carregar os anexos");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Por favor, selecione um arquivo para enviar");
      return;
    }

    try {
      setUploading(true);
      
      // Upload do arquivo para o bucket do Supabase
      const fileName = `${Date.now()}-${file.name}`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('crm_files')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obter a URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('crm_files')
        .getPublicUrl(fileName);

      // Salvar os metadados do arquivo na tabela crm_attachments
      const { data, error } = await supabase
        .from('crm_attachments')
        .insert({
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          contact_id: contactId,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) {
        throw error;
      }

      toast.success("Arquivo enviado com sucesso");
      setFile(null);
      fetchAttachments();
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo:", error);
      toast.error("Falha ao enviar o arquivo");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId: string, fileUrl: string) => {
    if (!confirm("Tem certeza que deseja excluir este anexo?")) {
      return;
    }

    try {
      // Extrair o nome do arquivo da URL
      const fileName = fileUrl.split('/').pop();
      
      // Excluir o registro do banco de dados
      const { error } = await supabase
        .from('crm_attachments')
        .delete()
        .eq('id', attachmentId);

      if (error) {
        throw error;
      }

      // Tentar excluir o arquivo do Storage (pode falhar se o arquivo não existir)
      if (fileName) {
        await supabase.storage
          .from('crm_files')
          .remove([fileName]);
      }

      toast.success("Anexo excluído com sucesso");
      fetchAttachments();
    } catch (error) {
      console.error("Erro ao excluir anexo:", error);
      toast.error("Falha ao excluir o anexo");
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
          className="max-w-xs"
        />
        <Button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          size="sm"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          {uploading ? "Enviando..." : "Enviar"}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-4">Carregando anexos...</div>
      ) : attachments.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">Nenhum anexo encontrado</div>
      ) : (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div 
              key={attachment.id} 
              className="flex items-center justify-between p-2 rounded border bg-card"
            >
              <div className="flex items-center space-x-2">
                {getFileIcon(attachment.file_type || "")}
                <span className="text-sm font-medium truncate max-w-xs">
                  {attachment.file_name}
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  asChild
                >
                  <a href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDelete(attachment.id, attachment.file_url)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
