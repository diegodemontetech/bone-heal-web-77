
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { File, UploadCloud, Trash2, ExternalLink } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface Attachment {
  id: string;
  file_name: string;
  file_url: string;
  file_type?: string;
  created_at: string;
  user_id?: string;
  user?: {
    full_name: string;
  };
}

interface AttachmentsListProps {
  contactId: string;
}

export const AttachmentsList = ({ contactId }: AttachmentsListProps) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchAttachments();
  }, [contactId]);

  const fetchAttachments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crm_attachments')
        .select(`
          *,
          user:user_id (
            full_name
          )
        `)
        .eq('contact_id', contactId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttachments(data || []);
    } catch (error) {
      console.error('Erro ao buscar anexos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      
      // Definir um nome de arquivo único
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `crm-attachments/${contactId}/${fileName}`;
      
      // Fazer upload para o storage do Supabase
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Obter a URL pública do arquivo
      const { data: urlData } = await supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);
        
      // Registrar no banco de dados
      const { error: dbError } = await supabase
        .from('crm_attachments')
        .insert({
          contact_id: contactId,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_type: file.type,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });
        
      if (dbError) throw dbError;
      
      toast.success('Arquivo enviado com sucesso');
      setFile(null);
      fetchAttachments();
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast.error(`Erro ao fazer upload: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId: string, fileUrl: string) => {
    try {
      // Extrair o caminho do arquivo da URL
      const urlParts = fileUrl.split('/');
      const filePath = urlParts.slice(urlParts.indexOf('attachments') + 1).join('/');
      
      // Excluir o registro do banco de dados
      const { error: dbError } = await supabase
        .from('crm_attachments')
        .delete()
        .eq('id', attachmentId);
        
      if (dbError) throw dbError;
      
      // Excluir o arquivo do storage (opcional, depende da política)
      await supabase.storage
        .from('attachments')
        .remove([filePath]);
      
      toast.success('Arquivo excluído com sucesso');
      setAttachments(attachments.filter(a => a.id !== attachmentId));
    } catch (error: any) {
      console.error('Erro ao excluir arquivo:', error);
      toast.error(`Erro ao excluir arquivo: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input 
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <Button 
          onClick={handleUpload} 
          disabled={!file || uploading}
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          {uploading ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : attachments.length === 0 ? (
        <div className="text-center py-10 text-gray-500 border rounded-md">
          <p>Nenhum anexo encontrado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div 
              key={attachment.id} 
              className="border rounded-md p-3 flex justify-between items-center"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <File className="h-5 w-5 flex-shrink-0 text-blue-500" />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">
                    {attachment.file_name}
                  </p>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <span>
                      {format(new Date(attachment.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                    {attachment.user?.full_name && (
                      <span>• {attachment.user.full_name}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => window.open(attachment.file_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => handleDelete(attachment.id, attachment.file_url)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
